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

export const OrdersTable = (props) => {
  const { items = [] } = props;
  const [orderDetails, setOrderDetails] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleViewClick = async (order) => {
    setOrderDetails(order.orderDetails);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Fecha
                </TableCell>
                <TableCell>
                  Tienda
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
              {items.map((order) => {
                return (
                  <TableRow
                    hover
                    key={order._id}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {new Date(order.date).toLocaleDateString('es-CO', options)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {order.shop.name}
                    </TableCell>
                    <TableCell>
                      {order.cityId.name}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" color="success"
                              onClick={() => handleViewClick(order)}>Ver Detalle</Button>
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
              <Typography variant="h5" gutterBottom>
                Detalles de la Orden
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow sticky="top">
                      <TableCell>Producto</TableCell>
                      <TableCell>Presentación</TableCell>
                      <TableCell>INVE</TableCell>
                      <TableCell>AVER</TableCell>
                      <TableCell>LOTE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderDetails.map((detail) => (
                      <TableRow key={detail._id}>
                        <TableCell>{detail.product.name}</TableCell>
                        <TableCell>{detail.product.presentation}</TableCell>
                        <TableCell>{detail.INVE}</TableCell>
                        <TableCell>{detail.AVER}</TableCell>
                        <TableCell>{detail.LOTE}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Modal>
        </Box>
      </Scrollbar>
    </Card>
  );
};
