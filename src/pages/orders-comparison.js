import Head from 'next/head';
import { Box } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OrdersComparison } from 'src/sections/order/orders-comparison';

const Page = () => {
  return (
    <>
      <Head>
        <title>Comparar Órdenes</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <OrdersComparison />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
