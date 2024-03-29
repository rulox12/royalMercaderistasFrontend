import {
  Box,
  Button,
  Card,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';

export const BigOrdersTable = (props) => {
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
                  Fecha
                </TableCell>
                <TableCell>
                  Estado
                </TableCell>
                <TableCell>
                  Ciudad
                </TableCell>
                <TableCell>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((bigOrder) => {
                return (
                  <TableRow
                    hover
                    key={bigOrder._id}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {bigOrder.date}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {bigOrder.status}
                    </TableCell>
                    <TableCell>
                      {bigOrder.cityId.name}
                    </TableCell>
                    <TableCell>
                      <Link href={`/big-order-details?id=${bigOrder._id}&city=${bigOrder.cityId._id}`} passHref>
                        <Button variant="outlined">Ver detalle</Button>
                      </Link>
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
