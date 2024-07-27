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
  Typography,
  Modal,
  Paper,
  TableContainer
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export const OrdersTable = (props) => {
  const { items = [] } = props;
  const [orderDetails, setOrderDetails] = useState([]);
  const [order, setOrder] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleViewClick = async (order) => {
    setOrderDetails(order.orderDetails);
    setOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(orderDetails.map(detail => ({
      Producto: detail.product.name,
      Presentación: detail.product.presentation,
      INVE: detail.INVE,
      AVER: detail.AVER,
      LOTE: detail.LOTE,
      RECI: detail.RECI,
      PEDI: detail.PEDI
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Detalles de la Orden');

    let orderDate = new Date(order.date);
    let year = orderDate.getUTCFullYear();
    let month = String(orderDate.getUTCMonth() + 1).padStart(2, '0'); // `getUTCMonth()` devuelve un valor basado en cero
    let day = String(orderDate.getUTCDate()).padStart(2, '0');
    let dateOnly = `${year}-${month}-${day}`;

    const fileName = `OrderDetails-${order.shop.name}-${dateOnly}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const options = {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return (
    <Card>
      <Scrollbar>
        <Box component={Paper} sx={{ maxHeight: 800 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: 2 }}>
                  Fecha
                </TableCell>
                <TableCell sx={{ padding: 0 }}>
                  Tienda
                </TableCell>
                <TableCell sx={{ padding: 0 }}>
                  Ciudad
                </TableCell>
                <TableCell sx={{ padding: 0 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((order) => {
                return (
                  <TableRow
                    hover
                    key={order._id}
                  >
                    <TableCell sx={{ padding: 1 }}>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">
                          {new Date(order.date).toLocaleDateString('es-CO', options)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ padding: 0 }}>
                      {order.shop.name}
                    </TableCell>
                    <TableCell sx={{ padding: 0 }}>
                      {order.cityId.name}
                    </TableCell>
                    <TableCell sx={{ padding: 0 }}>
                      <Button variant="outlined" color="success"
                              onClick={() => handleViewClick(order)} sx={{ paddingY: 0 }}>
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="order-details-modal"
            aria-describedby="order-details-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4
              }}
            >
              {order ? (
                <Typography variant="h6" gutterBottom>
                  Detalles de la Orden
                  - {order.shop.name} - {new Date(order.date).toLocaleDateString('es-CO', options)}
                </Typography>
              ) : (
                <Typography variant="h6" gutterBottom>
                  No se encontraron detalles de la orden
                </Typography>
              )}
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow sticky="top">
                      <TableCell sx={{ padding: 2 }}>Producto</TableCell>
                      <TableCell sx={{ padding: 0 }}>Presentación</TableCell>
                      <TableCell sx={{ padding: 0 }}>INVE</TableCell>
                      <TableCell sx={{ padding: 0 }}>AVER</TableCell>
                      <TableCell sx={{ padding: 0 }}>LOTE</TableCell>
                      <TableCell sx={{ padding: 0 }}>RECI</TableCell>
                      <TableCell sx={{ padding: 0 }}>PEDI</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderDetails.map((detail) => (
                      <TableRow key={detail._id}>
                        <TableCell sx={{ padding: 0 }}>{detail.product.name}</TableCell>
                        <TableCell sx={{ padding: 0 }}>{detail.product.presentation}</TableCell>
                        <TableCell sx={{ padding: 0 }}>{detail.INVE}</TableCell>
                        <TableCell sx={{ padding: 0 }}>{detail.AVER}</TableCell>
                        <TableCell sx={{ padding: 0 }}>{detail.LOTE}</TableCell>
                        <TableCell sx={{ padding: 0 }}>{detail.RECI}</TableCell>
                        <TableCell sx={{ padding: 0 }}>{detail.PEDI}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="contained"
                color="primary"
                onClick={handleExportToExcel}
                sx={{ mt: 2 }}
              >
                Exportar a Excel
              </Button>
            </Box>
          </Modal>
        </Box>
      </Scrollbar>
    </Card>
  );
};
