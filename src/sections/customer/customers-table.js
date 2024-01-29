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
import { deleteUser } from 'src/services/userService';

export const CustomersTable = (props) => {
  const {
    items = [],
    onUserUpdated
  } = props;

  const handleDeleteClick = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const response = await deleteUser(userId);
      if (response) {
        window.alert('La eliminación fue exitosa.');
        window.location.reload();
      } else {
        window.alert('Error al eliminar usuario');
      }
    }
  };

  const handleUpdated = (user) => {
    onUserUpdated(user);
  };

  const cast = (user) => {
    if (user.roleId) {
      const newUser = { ...user };
      newUser.roleId = newUser.roleId._id;
      return newUser;
    } else {
      return user;
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
                  Correo
                </TableCell>
                <TableCell>
                  Celular
                </TableCell>
                <TableCell>
                  Estado
                </TableCell>
                <TableCell>
                  Rol
                </TableCell>
                <TableCell>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                return (
                  <TableRow
                    hover
                    key={customer._id}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {customer.name} {customer.surname}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {customer.email}
                    </TableCell>
                    <TableCell>
                      {customer.phone}
                    </TableCell>
                    <TableCell>
                      {customer.roleId?.name}
                    </TableCell>
                    <TableCell>
                      {customer.state ? 'Activo' : 'Inactivo'}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={() => handleUpdated(cast(customer))}>Actualizar</Button>
                        <Button variant="outlined" color="error" onClick={() => handleDeleteClick(customer._id)}>Eliminar</Button>
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
