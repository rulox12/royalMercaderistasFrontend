import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Modal, Stack, SvgIcon, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CategoriesTable } from 'src/sections/category/categories-table';
import { CategoriesCreate } from 'src/sections/category/categories-create';
import { getCategories } from 'src/services/categoryService';
import { getProducts } from 'src/services/productService';
import { useState, useEffect, useCallback } from 'react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setAllProducts(prods);
    } catch (error) {
      console.error('Error cargando datos de categorías:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <Head>
        <title>Categorías de Productos</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Typography variant="h4">Categorías de Productos</Typography>
              <Button
                onClick={() => setOpen(true)}
                startIcon={
                  <SvgIcon fontSize="small">
                    <PlusIcon />
                  </SvgIcon>
                }
                variant="contained"
              >
                Nueva categoría
              </Button>
            </Stack>

            <CategoriesTable
              items={categories}
              allProducts={allProducts}
              onRefresh={loadData}
            />

            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-create-category"
            >
              <Box sx={modalStyle}>
                <Typography id="modal-create-category" variant="h6" sx={{ mb: 2 }}>
                  Crear Categoría
                </Typography>
                <CategoriesCreate />
              </Box>
            </Modal>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
