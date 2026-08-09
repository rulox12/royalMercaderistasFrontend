import {
  Button,
  Card,
  Chip,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { downloadOrderDetails } from '../../services/bigOrderService';

export const BigOrdersTable = (props) => {
  const { items = [] } = props;

  const formatDate = (dateString) => {
    return new Date(dateString);
  };

  items.sort((a, b) => formatDate(b.date).getTime() - formatDate(a.date).getTime());

  const handleExportClick = async (bigOrderId, date, cityId, platformId) => {
    const response = downloadOrderDetails(bigOrderId, date, cityId.name, platformId._id);
    if (response) {
      window.alert('Exporte realizado.');
    } else {
      window.alert('Error al generar exporte');
    }
  };

  const options = {
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return '-';
    }

    return new Date(dateValue).toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <Card>
      <TableContainer sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader>
            <TableHead
              sx={{
                background: 'linear-gradient(90deg, #0f2a43, #13385a, #0f2a43)',
                '& .MuiTableCell-root': {
                  position: 'sticky',
                  top: 0,
                  zIndex: 3,
                  backgroundColor: 'rgba(17, 52, 81, 0.98)',
                  color: '#f7fbff',
                  borderBottom: '2px solid rgba(143, 185, 227, 0.45)',
                  boxShadow: 'inset 0 -1px 0 rgba(173, 206, 238, 0.25)'
                }
              }}
            >
              <TableRow>
                <TableCell sx={{ padding: 2, fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Fecha</TableCell>
                <TableCell sx={{ padding: 0, fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ciudad</TableCell>
                <TableCell sx={{ padding: 0, fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Plataforma</TableCell>
                <TableCell sx={{ padding: 0, fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Creado</TableCell>
                <TableCell sx={{ padding: 0, fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Actualizado</TableCell>
                <TableCell sx={{ padding: 0, fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Estado</TableCell>
                <TableCell sx={{ padding: 0, fontWeight: 900, fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((bigOrder) => {
                return (
                  <TableRow hover key={bigOrder._id}>
                    <TableCell sx={{ padding: 0 }}>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">{new Date(bigOrder.date).toLocaleDateString(
                          'es-CO',
                          options)}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ padding: 0 }}>{bigOrder.cityId.name}</TableCell>
                    <TableCell sx={{ padding: 0 }}>{bigOrder.platformId?.name}</TableCell>
                    <TableCell sx={{ padding: 0 }}>{formatDateTime(bigOrder.createdAt)}</TableCell>
                    <TableCell sx={{ padding: 0 }}>{formatDateTime(bigOrder.updatedAt)}</TableCell>
                    <TableCell sx={{ padding: 0 }}>
                      <Chip
                        label={bigOrder.status}
                        size="small"
                        color={bigOrder.status === 'Approved' ? 'success' : 'warning'}
                        sx={{ fontWeight: 700, minWidth: 92 }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: 0 }}>
                      <Link
                        href={`/big-order-details?id=${bigOrder._id}&cityId=${bigOrder.cityId._id}`}
                        passHref
                      >
                        <Button variant="outlined" sx={{ paddingY: 0 }}>Ver detalle</Button>
                      </Link>
                      <Button variant="outlined" sx={{ m: 1, paddingY: 0 }} onClick={() => handleExportClick(
                        bigOrder._id,
                        bigOrder.date,
                        bigOrder.cityId,
                        bigOrder.platformId
                      )}>
                        Exportar información
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
      </TableContainer>
    </Card>
  );
};
