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
import { deleteShop } from 'src/services/shopService';

export const ShopsTable = (props) => {
  const {
    items = [],
    onShopUpdated
  } = props;

  const handleDeleteClick = async (shopId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este local?')) {
      const response = await deleteShop(shopId);
      if (response) {
        window.alert('La eliminación fue exitosa.');
        window.location.reload();
      } else {
        window.alert('Error al eliminar usuario');
      }
    }
  };

  const handleUpdated = (shop) => {
    onShopUpdated(shop);
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Nro
                </TableCell>
                <TableCell>
                  Nombre
                </TableCell>
                <TableCell>
                  Dirección
                </TableCell>
                <TableCell>
                  Gerente
                </TableCell>
                <TableCell>
                  Teléfono
                </TableCell>
                <TableCell>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((shop) => {
                return (
                  <TableRow
                    hover
                    key={shop._id}
                  >
                    <TableCell>
                      {shop.shopNumber}
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {shop.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {shop.address}
                    </TableCell>
                    <TableCell>
                      {shop.manager}
                    </TableCell>
                    <TableCell>
                      {shop.phone}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={() => handleUpdated(shop)}>Actualizar</Button>
                        <Button variant="outlined" color="error" onClick={() => handleDeleteClick(shop._id)}>Eliminar</Button>
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
