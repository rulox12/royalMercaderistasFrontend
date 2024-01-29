import {
  Box,
  Button,
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
import { deleteSupplier } from 'src/services/supplierService';

export const SuppliersTable = (props) => {
  const {
    items = [],
  } = props;

  const handleDeleteClick = async (supplierId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      const response = await deleteSupplier(supplierId);
      if(response){
        window.alert('La eliminación fue exitosa.');
        window.location.reload();
      }
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
                  Nombre
                </TableCell>
                <TableCell>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((supplier) => {
                return (
                  <TableRow
                    hover
                    key={supplier._id}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {supplier.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" color="error" onClick={() => handleDeleteClick(supplier._id)}>Eliminar</Button>
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
