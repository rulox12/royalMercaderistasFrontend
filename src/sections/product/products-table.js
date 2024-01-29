import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import { Scrollbar } from 'src/components/scrollbar';
import { deleteProduct } from 'src/services/productService';

export const ProductsTable = (props) => {
  const {
    items = [],
    onProductUpdated
  } = props;

  const handleDeleteClick = async (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const response = await deleteProduct(productId);
      if (response) {
        window.alert('La eliminación fue exitosa.');
        window.location.reload();
      } else {
        window.alert('Error al eliminar producto');
      }
    }
  };

  const handleProductUpdated = (product) => {
    onProductUpdated(product);
  };

  const cast = (product) => {
    if (product.supplierId) {
      const newProduct = { ...product }
      newProduct.supplierId = newProduct.supplierId._id;
      return newProduct
    } else {
      return product;
    }
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Nombre del Producto
                </TableCell>
                <TableCell>
                  Presentación
                </TableCell>
                <TableCell>
                  Proveedor
                </TableCell>
                <TableCell>
                  Nombre a Mostrar
                </TableCell>
                <TableCell>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((product) => {
                return (
                  <TableRow
                    hover
                    key={product.internalProductNumber}
                  >
                    <TableCell>
                      <Typography variant="subtitle2">
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {product.presentation}
                    </TableCell>
                    <TableCell>
                      {product.supplierId?.name}
                    </TableCell>
                    <TableCell>
                      {product.displayName}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={() => handleProductUpdated(cast(product))}>Actualizar</Button>
                        <Button variant="outlined" color="error" onClick={() => handleDeleteClick(product._id)}>Eliminar</Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};
