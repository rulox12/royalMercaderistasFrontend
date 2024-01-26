import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Snackbar,
  Alert,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { getProducts } from 'src/services/productService';
import { createProduct } from 'src/services/productService';

export const ProductsCreate = () => {
  const [product, setProduct] = useState({
    name: '',
    presentation: '',
    quantity: '',
    supplier: '',
    displayName: '',
    internalProductNumber: ''
  });
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const handleClick = (type, message) => {
    setAlertType(type);
    setAlertMessage(message)
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const [products, setProducts] = useState([]);

  const getProductsService = async () => {
    try {
      const response = await getProducts();
      setProducts(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = useCallback(
    (event) => {
      setProduct((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  const handleSaveProduct = async () => {
    try {
      const response = await createProduct(product);
      handleClick('success', 'Producto creado correctamente');
      window.location.reload();
    } catch (error) {
      handleClick('error', 'Error al crear producto');
      console.log('Error al guardar producto:', error);
    }
  };

  useEffect(() => {
    getProductsService();
  }, []);

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Snackbar open={open}
        autoHideDuration={6000}
        onClose={handleClose}>
        <Alert onClose={handleClose}
          severity={alertType}
          sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Card>
        <CardHeader
          subheader=""
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Nombre"
                  name="name"
                  onChange={handleChange}
                  required
                  value={product.name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Presentación"
                  name="presentation"
                  onChange={handleChange}
                  required
                  value={product.presentation}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Cantidad"
                  name="quantity"
                  onChange={handleChange}
                  required
                  type="number"
                  value={product.quantity}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Proveedor"
                  name="supplier"
                  onChange={handleChange}
                  required
                  value={product.supplier}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Nombre a Mostrar"
                  name="displayName"
                  onChange={handleChange}
                  required
                  value={product.displayName}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Referencia interna"
                  name="internalProductNumber"
                  onChange={handleChange}
                  required
                  value={product.internalProductNumber}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained"
            onClick={handleSaveProduct} >
            Guardar Producto
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
