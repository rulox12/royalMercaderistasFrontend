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

  return (
    <Card>
      <Scrollbar>
        <Box sx={{
          flexGrow: 1,
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: 2 }}>Fecha</TableCell>
                <TableCell sx={{ padding: 0 }}>Estado</TableCell>
                <TableCell sx={{ padding: 0 }}>Ciudad</TableCell>
                <TableCell sx={{ padding: 0 }}>Plataforma</TableCell>
                <TableCell sx={{ padding: 0 }}>Acciones</TableCell>
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
                    <TableCell sx={{ padding: 0 }}>{bigOrder.status}</TableCell>
                    <TableCell sx={{ padding: 0 }}>{bigOrder.cityId.name}</TableCell>
                    <TableCell sx={{ padding: 0 }}>{bigOrder.platformId?.name}</TableCell>
                    <TableCell sx={{ padding: 0 }}>
                      <Link
                        href={`/big-order-details?id=${bigOrder._id}&cityId=${bigOrder.cityId._id}`}
                        passHref
                      >
                        <Button variant="outlined" sx={{ paddingY: 0 }}>Ver detalle</Button>
                      </Link>
                      <Button variant="outlined" sx={{ m: 1 }} onClick={() => handleExportClick(
                        bigOrder._id,
                        bigOrder.date,
                        bigOrder.cityId,
                        bigOrder.platformId
                      )} sx={{ paddingY: 0 }}>
                        Exportar información
                      </Button>
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
