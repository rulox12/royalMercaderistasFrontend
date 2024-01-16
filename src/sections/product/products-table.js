import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

export const ProductsTable = (props) => {
  const {
    items = [],
  } = props;

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
                  Cantidad
                </TableCell>
                <TableCell>
                  Proveedor
                </TableCell>
                <TableCell>
                  Nombre a Mostrar
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
                      {product.quantity}
                    </TableCell>
                    <TableCell>
                      {product.supplier}
                    </TableCell>
                    <TableCell>
                      {product.displayName}
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
