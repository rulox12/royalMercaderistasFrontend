import { useState, useEffect } from 'react';
import { Box, Button, Container, Stack, TextField, Typography, MenuItem } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import { allShopsExport, genericExport } from '../services/exportService';
import { getCities } from '../services/cityService';
import Head from 'next/head';

const Page = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderDetailToExport, setOrderDetailToExport] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState('');
  const [divideByLocale, setDivideByLocale] = useState('');
  useEffect(() => {
    const fetchCities = async () => {
      let response = await getCities();
      response.push({ '_id': '123', name: 'Todos' });
      setCities(response);
    };

    fetchCities();

    return () => {

    };
  }, []);

  const handleExport = async () => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    if(divideByLocale == 'SI') {
      const response = await genericExport(
        formattedStartDate,
        formattedEndDate,
        orderDetailToExport,
        cityId
      );
    }else{
      const response = await allShopsExport(
        formattedStartDate,
        formattedEndDate,
        orderDetailToExport,
        cityId
      );
    }
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Head>
        <title>
          Ciudades
        </title>
      </Head>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Exportar Datos
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Fecha de inicio"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              label="Fecha de fin"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              select
              label="Detalle de la orden a exportar"
              value={orderDetailToExport}
              onChange={(e) => setOrderDetailToExport(e.target.value)}
            >
              {['INVE', 'AVER', 'LOTE', 'RECI', 'PEDI'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Ciudad"
              value={city}
              onChange={(e) => {
                const selectedCity = e.target.value;
                setCity(selectedCity);
                const selectedCityId = cities.find((c) => c.name === selectedCity)?._id;
                setCityId(selectedCityId);
              }}
            >
              {cities.map((city) => (
                <MenuItem key={city._id} value={city.name}>
                  {city.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Quieres Acomulado o divido por tienda"
              value={divideByLocale}
              onChange={(e) => setDivideByLocale(e.target.value)}
            >
              {['SI', 'NO'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option === 'SI' ? 'Acomulado' : 'Divido por tienda' }
                </MenuItem>
              ))}
            </TextField>
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
