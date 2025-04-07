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

export const UnregisteredOrdersTable = ({ items = [] }) => {
  return (
    <Card>
      <Box component={Paper}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: 2 }}>Tienda</TableCell>
                <TableCell sx={{ padding: 2 }}>Mercaderista</TableCell>
                <TableCell sx={{ padding: 2 }}>Plataforma</TableCell>
                <TableCell sx={{ padding: 2 }}>Ciudad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((order) => (
                <TableRow hover key={order._id}>
                  <TableCell sx={{ padding: 1 }}>
                    <Typography variant="subtitle2">{order.name}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: 1 }}>{order.userId?.name + " " + order.userId?.surname }</TableCell>
                  <TableCell sx={{ padding: 1 }}>{order.platformId?.name }</TableCell>
                  <TableCell sx={{ padding: 1 }}>{order.cityId?.name }</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};