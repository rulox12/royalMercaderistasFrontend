import {
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { deleteRole } from 'src/services/roleService';

const normalizeRoleName = (name = '') => String(name)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase();

const isAdminRoleName = (name) => ['admin', 'administrador'].includes(normalizeRoleName(name));

export const RolesTable = (props) => {
  const {
    items = [],
    onEdit,
  } = props;

  const handleDeleteClick = async (roleId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
      const response = await deleteRole(roleId);
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
                  Descripción
                </TableCell>
                <TableCell>
                  Permisos
                </TableCell>
                <TableCell>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((role) => {
                return (
                  <TableRow
                    hover
                    key={role._id}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {role.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {role.description}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        gap={1}
                      >
                        {isAdminRoleName(role.name) ? (
                          <Chip
                            color="primary"
                            label="Todos los permisos"
                            size="small"
                          />
                        ) : (role.permissions || []).length ? role.permissions.map((permission) => (
                          <Chip
                            key={permission}
                            label={permission}
                            size="small"
                          />
                        )) : (
                          <Typography
                            color="text.secondary"
                            variant="body2"
                          >
                            Sin permisos
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                      >
                        <Button
                          onClick={() => onEdit(role)}
                          variant="outlined"
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          onClick={() => handleDeleteClick(role._id)}
                          variant="outlined"
                        >
                          Eliminar
                        </Button>
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
