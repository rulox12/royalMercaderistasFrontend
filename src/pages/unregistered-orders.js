import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Box, Container, Stack, Typography, TextField, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import { getUnregisteredOrders } from '../services/orderService';
import { UnregisteredOrdersTable } from '../sections/order/unregistered-orders-table';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

const UnregisteredOrdersPage = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUnregisteredShops = async () => {
    setLoading(true);
    try {
      const response = await getUnregisteredOrders(selectedDate);
      const orders = response.notReceivedShops || [];

      // Extraer opciones únicas de plataformas y ciudades
      const uniquePlatforms = [...new Set(orders.map(order => order.platformId?.name).filter(Boolean))];
      const uniqueCities = [...new Set(orders.map(order => order.cityId?.name).filter(Boolean))];

      setShops(orders);
      setFilteredShops(orders);
      setPlatforms(uniquePlatforms);
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error fetching unregistered shops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnregisteredShops();
  }, [selectedDate]);

  // Filtrar por plataforma y ciudad
  useEffect(() => {
    let filtered = shops;

    if (selectedPlatform) {
      filtered = filtered.filter(order => order.platformId?.name === selectedPlatform);
    }
    if (selectedCity) {
      filtered = filtered.filter(order => order.cityId?.name === selectedCity);
    }

    setFilteredShops(filtered);
  }, [selectedPlatform, selectedCity, shops]);

  return (
    <>
      <Head>
        <title>Órdenes No Registradas</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Órdenes No Registradas</Typography>

            {/* Filtros */}
            <Stack direction="row" justifyContent="flex-end" flexWrap="wrap" gap={2}>
              {/* Filtro de Fecha */}
              <FormControl sx={{ width: 200 }}>
                <TextField
                  type="date"
                  fullWidth
                  label="Fecha"
                  name="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </FormControl>

              {/* Filtro de Plataforma */}
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="platform-select-label">Plataforma</InputLabel>
                <Select
                  labelId="platform-select-label"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {platforms.map((platform) => (
                    <MenuItem key={platform} value={platform}>{platform}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Filtro de Ciudad */}
              <FormControl sx={{ width: 200 }}>
                <InputLabel>Ciudad</InputLabel>
                <Select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Tabla de órdenes filtradas */}
            <UnregisteredOrdersTable items={filteredShops} />
            {loading && <Typography>Cargando...</Typography>}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

UnregisteredOrdersPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UnregisteredOrdersPage;