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
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { deleteCity } from 'src/services/cityService';

export const CitiesTable = (props) => {
  const {
    items = [],
  } = props;

  const handleDeleteClick = async (cityId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este ciudad?')) {
      const response = await deleteCity(cityId);
      if(response){
        window.alert('La eliminación fue exitosa.');
        window.location.reload();
      }else{
        window.alert('Error al eliminar ciudad');
      }
    }
  };

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
                  Departamento
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((city) => {
                return (
                  <TableRow
                    hover
                    key={city._id}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {city.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {city.department}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" color="error" onClick={() => handleDeleteClick(city._id)}>Eliminar</Button>
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
