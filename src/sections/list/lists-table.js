import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { deleteList } from '../../services/listService';
import { Stack } from '@mui/system';


export const ListTable = (props) => {
  const {
    items = [],
  } = props;

  const handleDeleteClick = async (listId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar la lista?')) {
      const response = await deleteList(listId);
      if (response) {
        window.alert('La eliminación fue exitosa.');
        window.location.reload();
      } else {
        window.alert('Error al eliminar producto');
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
              {items.map((list) => (
                <TableRow hover key={list._id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {list.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Link href={`/lists-products?id=${list._id}`} passHref>
                        <Button variant="outlined">Agregar o eliminar productos</Button>
                      </Link>
                      <Button variant="outlined" color="error" onClick={() => handleDeleteClick(list._id)}>Eliminar</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};
