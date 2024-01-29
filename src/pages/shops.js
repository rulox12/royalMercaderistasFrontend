import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Modal, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ShopsTable } from 'src/sections/shop/shops-table';
import { ShopsSearch } from 'src/sections/shop/shops-search';
import { getShops } from 'src/services/shopService';
import { useState, useEffect } from 'react';
import { ShopsCreate } from 'src/sections/shop/shops-create';

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

  const [shops, setShops] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedShop, setSelectedShop] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleShopUpdated = (updatedShop) => {
    setSelectedShop(updatedShop);
    setIsUpdate(true);
    handleOpen();
  };

  const getShopsService = async () => {
    try {
      const response = await getShops();
      setShops(response);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  useEffect(() => {
    getShopsService();
  }, []);

  return (
    <>
      <Head>
        <title>
          Locales
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
                  Locales
                </Typography>

              </Stack>
              <div>
                <Button
                  onClick={handleOpen}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Agregar nuevo local
                </Button>
              </div>
            </Stack>
            <ShopsSearch />
            <ShopsTable
              count={shops.length}
              items={shops}
              onShopUpdated={handleShopUpdated}
            />
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {isUpdate ? 'Actualizar Local' : 'Crear Local'}
                </Typography>
                <div id="modal-modal-description" sx={{ mt: 2 }}>
                  <ShopsCreate shop={selectedShop} isUpdate={isUpdate} />
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
