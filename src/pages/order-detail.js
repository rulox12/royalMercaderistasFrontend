import { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Stack, TextField, MenuItem, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { getCities } from '../services/cityService';
import Head from 'next/head';
import { getShops } from '../services/shopService';
import { getOrderByFilter } from '../services/orderService';

const Page = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [shops, setShops] = useState([]);
  const [shop, setShop] = useState('');
  const [orderDetails, setOrderDetails] = useState([]);
  const [order, setOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      let response = await getCities();
      response.push({ '_id': '123', name: 'Todos' });
      setCities(response);
    };

    fetchCities().then(r => {});
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      if (city && city._id) {
        if (city.name === 'Todos') {
          let response = await getShops();
          setShops(response);
        } else {
          let response = await getShops({ cityId: city._id });
          setShops(response);
        }
      } else {
        setShops([]);
      }
    };

    fetchShops().then(r => {});
  }, [city]);

  const handleDetailOrder = async () => {
    const response = await getOrderByFilter(date, city._id, shop._id);
    if (response.orders.length > 0) {
      setOrderDetails(response.orders[0].orderDetails);
      setOrder(response.orders[0]);
      setOpenModal(true);
    } else {
      setOrderDetails([]);
      setOrder(null);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };


  const options = {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const handleExportToExcel = () => {
    // Implementa aquí la lógica para exportar a Excel
  };

  return (
    <>
      <Head>
        <title>
          Detalle de orden
        </title>
      </Head>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Detalle de la orden
          </Typography>
          <Stack spacing={2}>
            <Box display="flex" gap={2}>
              <TextField
                label="Fecha"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                select
                label="Ciudad"
                value={city}
                onChange={(e) => {
                  const selectedCity = e.target.value;
                  setCity(selectedCity);
                }}
                sx={{ flex: 1 }}
              >
                {cities.map((city) => (
                  <MenuItem key={city._id} value={city}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                select
                label="Tienda"
                value={shop}
                onChange={(e) => {
                  const selectedShop = e.target.value;
                  setShop(selectedShop);
                }}
                sx={{ flex: 1 }}
              >
                {shops.map((shop) => (
                  <MenuItem key={shop._id} value={shop}>
                    {shop.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Button variant="contained" onClick={handleDetailOrder}>
              Detalle
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* Modal para mostrar los detalles de la orden */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="order-details-modal"
        aria-describedby="order-details-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          {order ? (
            <Typography variant="h6" gutterBottom>
              Detalles de la Orden - {order.shop.name} - {new Date(order.date).toLocaleDateString('es-CO', options)}
            </Typography>
          ) : (
            <Typography variant="h6" gutterBottom>
              No se encontraron detalles de la orden
            </Typography>
          )}
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Presentación</TableCell>
                  <TableCell>INVE</TableCell>
                  <TableCell>AVER</TableCell>
                  <TableCell>LOTE</TableCell>
                  <TableCell>RECI</TableCell>
                  <TableCell>PEDI</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderDetails.map((detail) => (
                  <TableRow key={detail._id}>
                    <TableCell>{detail.product.name}</TableCell>
                    <TableCell>{detail.product.presentation}</TableCell>
                    <TableCell>{detail.INVE}</TableCell>
                    <TableCell>{detail.AVER}</TableCell>
                    <TableCell>{detail.LOTE}</TableCell>
                    <TableCell>{detail.RECI}</TableCell>
                    <TableCell>{detail.PEDI}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;