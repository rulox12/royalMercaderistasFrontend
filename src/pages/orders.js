import Head from 'next/head';
import { Box, Button, Container, Modal, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';
import { OrdersTable } from '../sections/order/orders-table';

const Page = () => {

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  const getOrdersService = async () => {
    try {
      const response = await getOrders(page, limit );
      setOrders(response.orders);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    getOrdersService(page, limit).then(r => {});
  }, [page, limit]);

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
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </Button>
              <Typography variant="body2">
                Página {page} de {totalPages}
              </Typography>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Siguiente
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
