import Head from 'next/head';
import { Box } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LocalDashboard } from 'src/sections/dashboard/local-dashboard';
import { useAuthContext } from 'src/contexts/auth-context';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { hasPermission } from 'src/utils/permissions';

const Page = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const canViewLocalDashboard = hasPermission(user, 'dashboard.local');

  useEffect(() => {
    if (user && !canViewLocalDashboard) {
      router.replace('/');
    }
  }, [canViewLocalDashboard, router, user]);

  if (user && !canViewLocalDashboard) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard Local</title>
      </Head>
      <Box
        component="main"
        sx={{ flexGrow: 1, py: 0 }}
      >
        <LocalDashboard />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
