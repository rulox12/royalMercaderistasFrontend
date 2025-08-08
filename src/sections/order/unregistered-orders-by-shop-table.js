import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableContainer
} from '@mui/material';

const formatDateWithDay = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const UnregisteredOrdersByShopTable = ({ items = [] }) => {
  return (
    <Card>
      <Box component={Paper}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: 2 }}>Fecha</TableCell>
                <TableCell sx={{ padding: 2 }}>Local</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((order) => (
                <TableRow hover key={order._id}>
                  <TableCell sx={{ padding: 1 }}>
                    <Typography variant="subtitle2">{formatDateWithDay(order.date)}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: 1 }}>{order.shop?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};