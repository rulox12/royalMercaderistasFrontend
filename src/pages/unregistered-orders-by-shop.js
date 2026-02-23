import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material';
import {
  getUnregisteredOrdersByShopAndRange
} from '../services/orderService';
import { UnregisteredOrdersByShopTable } from '../sections/order/unregistered-orders-by-shop-table';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { getShops } from '../services/shopService';

const UnregisteredOrdersByShopPage = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEndDate, setSelectedEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedShop, setSelectedShop] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUnregisteredShops = useCallback(async () => {
    if (!selectedShop) {
      return;
    }
    setLoading(true);
    try {
      const response = await getUnregisteredOrdersByShopAndRange(selectedShop._id,
        selectedStartDate,
        selectedEndDate);
      const orders = response.notReceivedShops || [];
      setFilteredShops(orders);
    } catch (error) {
      console.error('Error fetching unregistered shops:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedShop, selectedStartDate, selectedEndDate]);

  useEffect(() => {
    fetchUnregisteredShops().then(r => {});
  }, [fetchUnregisteredShops]);

  // Filtrar por plataforma y ciudad
  useEffect(() => {
    const fetchShops = async () => {
      let response = await getShops();
      setShops(response);
    };

    fetchShops();
  }, []);

  return (
    <>
      <Head>
        <title>Órdenes No Registradas</title>
      </Head>
      <Box
        component="main"
        sx={{ flexGrow: 1, py: 8 }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Typography
                variant="h4"
                sx={{ whiteSpace: 'nowrap' }}
              >
                Órdenes No Registradas
              </Typography>

              {/* Filtros */}
              <Stack
                direction="row"
                justifyContent="flex-end"
                flexWrap="nowrap"
                gap={2}
              >
                <FormControl sx={{ width: 200 }}>
                  <TextField
                    type="date"
                    fullWidth
                    label="Fecha"
                    name="date"
                    value={selectedStartDate}
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                  />
                </FormControl>
                <FormControl sx={{ width: 200 }}>
                  <TextField
                    type="date"
                    fullWidth
                    label="Fecha"
                    name="date"
                    value={selectedEndDate}
                    onChange={(e) => setSelectedEndDate(e.target.value)}
                  />
                </FormControl>
                <FormControl sx={{ width: 200 }}>
                  <InputLabel id="platform-select-label">Tienda</InputLabel>
                  <Select
                    labelId="platform-select-label"
                    value={selectedShop}
                    onChange={(e) => setSelectedShop(e.target.value)}
                  >
                    {shops.map((shop) => (
                      <MenuItem
                        key={shop._id}
                        value={shop}
                      >
                        {shop.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>

            {/* Tabla de órdenes filtradas */}
            <UnregisteredOrdersByShopTable items={filteredShops}/>
            {loading && <Typography>Cargando...</Typography>}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

UnregisteredOrdersByShopPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UnregisteredOrdersByShopPage;