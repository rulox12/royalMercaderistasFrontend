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
  TableContainer,
} from "@mui/material";

const formatDateWithDay = (isoDateString) => {
  const [year, month, day] = isoDateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
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
                <TableCell sx={{ padding: 2 }}>Ciudad</TableCell>
                <TableCell sx={{ padding: 2 }}>Usuario</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((order) => (
                <TableRow hover key={order._id}>
                  <TableCell sx={{ padding: 1 }}>
                    <Typography variant="subtitle2">{formatDateWithDay(order.date)}</Typography>
                  </TableCell>
                  <TableCell sx={{ padding: 1 }}>{order.shop?.name}</TableCell>
                  <TableCell sx={{ padding: 1 }}>{order.shop?.city}</TableCell>
                  <TableCell sx={{ padding: 1 }}>{order.shop?.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};
