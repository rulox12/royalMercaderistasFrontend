import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Modal, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useState, useEffect } from 'react';
import { RolesSearch } from 'src/sections/role/roles-search';
import { RolesTable } from 'src/sections/role/roles-table';
import { RolesCreate } from 'src/sections/role/roles-create';
import { getRoles } from 'src/services/roleService';

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

  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getRolesService = async () => { 
    try {
      const response = await getRoles();
      setRoles(response); 
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    getRolesService();
  }, []);

  return (
    <>
      <Head>
        <title>
          Roles
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
                  Roles
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
                  Agregar un nuevo rol
                </Button>
              </div>
            </Stack>
            <RolesSearch />
            <RolesTable
              count={roles.length} 
              items={roles}
              />
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Crear Rol
                </Typography>
                <div id="modal-modal-description" sx={{ mt: 2 }}>
                  <RolesCreate />
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
