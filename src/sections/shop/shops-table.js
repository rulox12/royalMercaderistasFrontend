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

export const ShopsTable = (props) => {
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
                  Dirección
                </TableCell>
                <TableCell>
                  Gerente
                </TableCell>
                <TableCell>
                  Teléfono
                </TableCell>
                <TableCell>
                  Estado
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
                      {shop.state ? 'Activo' : 'Inactivo'}
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
