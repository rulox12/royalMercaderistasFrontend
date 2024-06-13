import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Modal, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { getUsers } from 'src/services/userService';
import { useState, useEffect } from 'react';
import { CustomersCreate } from 'src/sections/customer/customers-create';

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

  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSelectedUser(null);
    setIsUpdate(false);
    setOpen(false);
  }

  const getUsersService = async () => {
    try {
      const response = await getUsers();
      setCustomers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserUpdated = (updatedUser) => {
    setSelectedUser(updatedUser);
    setIsUpdate(true);
    handleOpen();
  };

  useEffect(() => {
    getUsersService();
  }, []);

  return (
    <>
      <Head>
        <title>
          Usuarios
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
                  Usuarios
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
                  Agregar nuevo usuario
                </Button>
              </div>
            </Stack>
            <CustomersTable
              count={customers.length}
              items={customers}
              onUserUpdated={handleUserUpdated}
            />
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                {isUpdate ? 'Actualizar Usuario' : 'Crear Usuario'}
                </Typography>
                <div id="modal-modal-description" sx={{ mt: 2 }}>
                  <CustomersCreate user={selectedUser} isUpdate={isUpdate} />
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
