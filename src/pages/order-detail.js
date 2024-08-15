import { useState, useEffect } from 'react';
import {
  Container, Box, Typography, Stack, TextField, MenuItem, Button
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
      console.log(city);
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
    if (response.length > 0) {
      setOrderDetails(response[0].orderDetails);
    } else {
      setOrderDetails([]);
    }
  };

  const tableStyles = {
    tableContainer: {
      marginTop: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      backgroundColor: '#f4f4f4',
      fontWeight: 'bold',
      border: '1px solid #ddd',
      padding: '12px',
      textAlign: 'left'
    },
    td: {
      border: '1px solid #ddd',
      padding: '12px',
      textAlign: 'left'
    },
    evenRow: {
      backgroundColor: '#f9f9f9'
    },
    hoverRow: {
      backgroundColor: '#f1f1f1'
    }
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
      <div style={tableStyles.tableContainer}>
        <table style={tableStyles.table}>
          <thead>
          <tr>
            <th style={tableStyles.th}>Producto</th>
            <th style={tableStyles.th}>INVE</th>
            <th style={tableStyles.th}>AVER</th>
            <th style={tableStyles.th}>LOTE</th>
            <th style={tableStyles.th}>RECI</th>
            <th style={tableStyles.th}>PEDI</th>
            <th style={tableStyles.th}>VENT</th>
            <th style={tableStyles.th}>PEDI REAL</th>
          </tr>
          </thead>
          <tbody>
          {orderDetails.map((detail, index) => (
            <tr key={detail._id} style={index % 2 === 0 ? tableStyles.evenRow : null}
                className="hover-row">
              <td style={tableStyles.td}>{detail.product.name}</td>
              <td style={tableStyles.td}>{detail.INVE}</td>
              <td style={tableStyles.td}>{detail.AVER}</td>
              <td style={tableStyles.td}>{detail.LOTE}</td>
              <td style={tableStyles.td}>{detail.RECI}</td>
              <td style={tableStyles.td}>{detail.PEDI}</td>
              <td style={tableStyles.td}>{detail.VENT}</td>
              <td style={tableStyles.td}>{detail.PEDI_REAL}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
