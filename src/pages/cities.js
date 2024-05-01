import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Modal, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CitiesTable } from 'src/sections/city/cities-table'; // Cambiado a manejar ciudades
import { CitiesSearch } from 'src/sections/city/cities-search'; // Cambiado a manejar ciudades
import { getCities } from 'src/services/cityService'; // Cambiado a manejar ciudades
import { useState, useEffect } from 'react';
import { CitiesCreate } from 'src/sections/city/cities-create'; // Cambiado a manejar ciudades

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

  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getCitiesService = async () => {
    try {
      const response = await getCities();
      setCities(response);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    getCitiesService();
  }, []);

  return (
    <>
      <Head>
        <title>
          Ciudades
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
                  Ciudades
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
                  Agregar nueva ciudad
                </Button>
              </div>
            </Stack>
            <CitiesSearch />
            <CitiesTable
              count={cities.length}
              items={cities}
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
