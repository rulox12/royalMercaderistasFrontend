import { useState, useEffect } from 'react';
import { Box, Button, Container, Stack, TextField, Typography, MenuItem } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import { largeExport } from '../services/exportService';
import { getCities, getCity } from '../services/cityService';
import Head from 'next/head';
import { getPlatform, getPlatforms } from '../services/platformService';

const Page = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [cities, setCities] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [cityId, setCityId] = useState('');
  const [platformId, setPlatformId] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      let response = await getCities();
      response.push({ '_id': '123', name: 'Todos' });
      setCities(response);
    };

    const fetchPlatforms = async () => {
      let response = await getPlatforms();
      setPlatforms(response);
    };

    fetchCities();
    fetchPlatforms();

    return () => {

    };
  }, []);

  const handleExport = async () => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const platform = await getPlatform(platformId);
    let request = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      platformId: platform._id
    };
    let fileName = `${formattedStartDate}_${formattedEndDate}_${platform.name}_`;
    if (cityId !== '123') {
      const city = await getCity(cityId);
      fileName += city.name;
      request['cityId'] = city._id;
    } else {
      request['cityId'] = cityId;
      fileName += 'all';
    }

    const response = await largeExport(request, fileName);
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Head>
        <title>
          Reportes
        </title>
      </Head>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Exportar Datos
          </Typography>
          <Stack spacing={2}>
            <Box display="flex" gap={2}>
              <TextField
                label="Fecha de inicio"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Fecha de fin"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
                sx={{ flex: 1 }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                select
                label="Ciudad"
                onChange={(e) => {
                  const selectedCity = e.target.value;
                  const selectedCityId = cities.find((c) => c.name === selectedCity)?._id;
                  setCityId(selectedCityId);
                }}
                sx={{ flex: 1 }}
              >
                {cities.map((city) => (
                  <MenuItem key={city._id} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Plataforma"
                onChange={(e) => {
                  const selectedPlatformId = e.target.value;
                  setPlatformId(selectedPlatformId);
                }}
                sx={{ flex: 1 }}
              >
                {platforms.map((platform) => (
                  <MenuItem key={platform._id} value={platform._id}>
                    {platform.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Button variant="contained" onClick={handleExport}>
              Exportar
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
