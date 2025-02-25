import Head from 'next/head';
import { Box, Button, Container, Modal, Stack, SvgIcon, Typography } from '@mui/material';
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';
import { OrdersTable } from '../sections/order/orders-table';
import { getShops } from '../services/shopService';

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [totalPages, setTotalPages] = useState(0);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');



  const fetchShops = async () => {
    try {
      const response = await getShops(); // Endpoint para obtener la lista de tiendas
      setShops(response);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const getOrdersService = async () => {
    try {
      const response = await getOrders(page, limit, selectedShop);
      setOrders(response.orders);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchShops().then(r => {});
  }, []);

  useEffect(() => {
    getOrdersService(page, limit).then(r => {});
  }, [page, limit, selectedShop]);

  return (
    <>
      <Head>
        <title>Órdenes</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Órdenes</Typography>
              </Stack>
              <FormControl sx={{ width: 300 }}>
                <InputLabel id="shop-select-label">Seleccionar tienda</InputLabel>
                <Select
                  labelId="shop-select-label"
                  value={selectedShop}
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
            <OrdersTable count={orders.length} items={orders} />
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
