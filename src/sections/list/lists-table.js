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


export const ListTable = (props) => {
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
                    <Link href={`/lists-products?id=${list._id}`} passHref>
                      <Button variant="outlined">Agregar o eliminar productos</Button>
                    </Link>
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
