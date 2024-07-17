import Head from 'next/head';
import { Box, Container, Modal, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useState, useEffect } from 'react';
import { CitiesCreate } from 'src/sections/city/cities-create';
import { getOrders } from '../services/orderService';
import { OrdersTable } from '../sections/order/orders-table';

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
    p: 4,
  };

  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const getOrdersService = async () => {
    try {
      const response = await getOrders();
      setOrders(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    console.log('useEffect ejecutado');
    getOrdersService().then(r => {});
  }, []);

  return (
    <>
      <Head>
        <title>
          Ordenes
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Ordenes
                </Typography>
              </Stack>
            </Stack>
            <OrdersTable
              count={orders.length}
              items={orders}
            />
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Crear Ciudad
                </Typography>
                <div id="modal-modal-description" sx={{ mt: 2 }}>
                  <CitiesCreate />
                </div>
              </Box>
            </Modal>
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
