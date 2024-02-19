import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Modal, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ProductsTable } from 'src/sections/product/products-table';
import { ProductsSearch } from 'src/sections/product/products-search';
import { getProducts } from 'src/services/productService';
import { useState, useEffect } from 'react';
import { ProductsCreate } from 'src/sections/product/products-create';

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

  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSelectedProduct(null);
    setIsUpdate(false);
    setOpen(false);
  }

  const getProductsService = async () => {
    try {
      const response = await getProducts();
      setProducts(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductUpdated = (updatedProduct) => {
    setSelectedProduct(updatedProduct);
    setIsUpdate(true);
    handleOpen();
  };

  useEffect(() => {
    getProductsService();
  }, []);

  return (
    <>
      <Head>
        <title>
          Productos
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
                  Productos
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
                  Agregar nuevo producto
                </Button>
              </div>
            </Stack>
            <ProductsSearch />
            <ProductsTable
              count={products.length}
              items={products}
              onProductUpdated={handleProductUpdated}
            />
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {isUpdate ? 'Actualizar Producto' : 'Crear Producto'}
                </Typography>
                <div id="modal-modal-description" sx={{ mt: 2 }}>
                  <ProductsCreate product={selectedProduct} isUpdate={isUpdate} />
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
