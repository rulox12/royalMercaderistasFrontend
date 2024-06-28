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
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { downloadOrderDetails } from "../../services/bigOrderService";

export const BigOrdersTable = (props) => {
  const { items = [] } = props;
  
  const formatDate = (dateString) => {
    let dateParts = dateString.split("/");

    let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

    return dateObject;
  }

  items.sort((a, b) => formatDate(b.date).getTime() - formatDate(a.date).getTime());

  const handleExportClick = async (bigOrderId, date, cityId) => {
    const response = downloadOrderDetails(bigOrderId, date, cityId.name);
    if (response) {
      window.alert("Exporte realizado.");
    } else {
      window.alert("Error al generar exporte");
    }
  };

  const options = {
    timeZone: 'UTC',
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Ciudad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((bigOrder) => {
                return (
                  <TableRow hover key={bigOrder._id}>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">{new Date(bigOrder.date).toLocaleDateString('es-CO', options)}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{bigOrder.status}</TableCell>
                    <TableCell>{bigOrder.cityId.name}</TableCell>
                    <TableCell>
                      <Link
                        href={`/big-order-details?id=${bigOrder._id}&cityId=${bigOrder.cityId._id}`}
                        passHref
                      >
                        <Button variant="outlined">Ver detalle</Button>
                      </Link>
                      <Button variant="outlined" sx={{ m: 1 }} onClick={() => handleExportClick(bigOrder._id, bigOrder.date, bigOrder.cityId)}>
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
