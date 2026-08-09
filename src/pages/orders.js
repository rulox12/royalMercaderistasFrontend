import Head from 'next/head';
import { Box, Button, Container, Modal, Stack, SvgIcon, Typography } from '@mui/material';
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useState, useEffect, useCallback } from 'react';
import { getOrders } from '../services/orderService';
import { OrdersTable } from '../sections/order/orders-table';
import { getShops } from '../services/shopService';
import { getCities } from '../services/cityService';
import { getPlatforms } from '../services/platformService';

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [totalPages, setTotalPages] = useState(0);
  const [shops, setShops] = useState([]);
  const [cities, setCities] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const fetchShops = useCallback(async () => {
    if (!selectedPlatform || !selectedCity) {
      setShops([]);
      setSelectedShop('');
      return;
    }

    try {
      const response = await getShops({
        platformId: selectedPlatform,
        cityId: selectedCity,
      });
      setShops(response);

      if (selectedShop && !(response || []).some((shop) => shop._id === selectedShop)) {
        setSelectedShop('');
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      setShops([]);
      setSelectedShop('');
    }
  }, [selectedPlatform, selectedCity, selectedShop]);

  const fetchCities = async () => {
    try {
      const response = await getCities();
      setCities(response);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await getPlatforms();
      setPlatforms(response);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  const getOrdersService = useCallback(async () => {
    try {
      const response = await getOrders(page, limit, selectedShop, selectedCity, selectedPlatform);
      setOrders(response.orders);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [page, limit, selectedShop, selectedCity, selectedPlatform]);

  useEffect(() => {
    fetchCities().then(r => {});
    fetchPlatforms().then(r => {});
  }, []);

  useEffect(() => {
    fetchShops().then(r => {});
  }, [fetchShops]);

  useEffect(() => {
    getOrdersService().then(r => {});
  }, [getOrdersService]);

  return (
    <>
      <Head>
        <title>Órdenes</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 2, padding: 0 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={1}
              sx={{
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 1000,
                paddingTop: 1.5,
                paddingBottom: 1,
              }}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Órdenes</Typography>
              </Stack>
              <Stack direction="row" justifyContent="flex-end" flexWrap="wrap" gap={2}>
                {/* Filtro de Plataformas */}
                <FormControl sx={{ width: 200 }}>
                  <InputLabel id="platform-select-label">Plataforma</InputLabel>
                  <Select
                    labelId="platform-select-label"
                    value={selectedPlatform}
                    onChange={(e) => {
                      setSelectedPlatform(e.target.value);
                      setPage(1);
                    }}
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    {platforms.map((platform) => (
                      <MenuItem key={platform._id} value={platform._id}>
                        {platform.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Filtro de Ciudades */}
                <FormControl sx={{ width: 200 }}>
                  <InputLabel id="city-select-label">Ciudad</InputLabel>
                  <Select
                    labelId="city-select-label"
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setPage(1);
                    }}
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city._id} value={city._id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ width: 200 }} spacing={1}>
                  <InputLabel id="shop-select-label">Tienda</InputLabel>
                  <Select
                    labelId="shop-select-label"
                    value={selectedShop}
                    disabled={!selectedPlatform || !selectedCity}
                    onChange={(e) => {
                      setSelectedShop(e.target.value);
                      setPage(1);
                    }}
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    {shops.map((shop) => (
                      <MenuItem key={shop._id} value={shop._id}>
                        {shop.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
            <OrdersTable count={orders.length} items={orders} onRefresh={getOrdersService} />
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Siguiente
              </Button>
              <Typography variant="body2">
                Página {page} de {totalPages}
              </Typography>
              <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Anterior
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
