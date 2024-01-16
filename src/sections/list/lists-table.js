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
              {items.map((element) => (
                <TableRow hover key={element.id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {element.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {/* Usar Link de Next.js para navegar a la página */}
                    <Link href={`/lists-products?id=${element._id}`} passHref>
                      <Button variant="outlined">Agregar productos o eliminar</Button>
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
