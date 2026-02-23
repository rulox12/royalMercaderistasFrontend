import Head from 'next/head';
import { Box } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LocalDashboard } from 'src/sections/dashboard/local-dashboard';

const Page = () => {
  return (
    <>
      <Head>
        <title>Dashboard Local</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <LocalDashboard />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
