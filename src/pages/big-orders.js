import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Modal, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useState, useEffect } from 'react';
import { getBigOrders } from 'src/services/bigOrderService';
import { BigOrdersTable } from 'src/sections/bigOrder/bigOrders-table';
import { BigOrdersCreate } from 'src/sections/bigOrder/bigOrders-create';

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

  const [bigOrders, setBigOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [totalPages, setTotalPages] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getBigOrdersService = async () => { 
    try {
      const response = await getBigOrders(page, limit);
      setBigOrders(response.bigOrders);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    getBigOrdersService(page, limit).then(r => {});
  }, [page, limit]);

  return (
    <>
      <Head>
        <title>
          Pedidos
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
                  Pedidos
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
                  Agregar nuevo pedido
                </Button>
              </div>
            </Stack>
            <BigOrdersTable
              count={bigOrders.length} 
              items={bigOrders}
              />
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
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Crear pedido
                </Typography>
                <div id="modal-modal-description" sx={{ mt: 2 }}>
                  <BigOrdersCreate />
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
