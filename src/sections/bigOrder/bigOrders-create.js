import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Snackbar,
  Alert,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { createBigOrder } from 'src/services/bigOrderService';
import { getCities } from 'src/services/cityService';
import { getPlatforms } from '../../services/platformService';

export const BigOrdersCreate = () => {
  const [bigOrder, setBigOrder] = useState({
    name: '',
    department: '',
    cityId: '',
    platformId: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [cities, setCities] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const handleClick = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleChange = useCallback(
    (event) => {
      setBigOrder((prevBigOrder) => ({
        ...prevBigOrder,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const getCitiesService = async () => {
    try {
      const response = await getCities();
      setCities(response);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const getPlatformsService = async () => {
    try {
      const response = await getPlatforms();
      setPlatforms(response);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        const response = await createBigOrder({
          date: formatDateString(bigOrder.date),
          cityId: bigOrder.cityId,
          platformId: bigOrder.platformId
        });
        handleClick('success', 'Pedido creado correctamente');
        window.location.reload();
      } catch (error) {
        handleClick('error', error.response.data.error);
      }
    },
    [bigOrder]
  );

  const formatDateString = (inputDate) => {
    return new Date(inputDate).toISOString();
  };

  useEffect(() => {
    getCitiesService();
    getPlatformsService();
  }, []);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Card>
        <CardHeader subheader=""/>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  type="date"
                  fullWidth
                  label="Fecha"
                  name="date"
                  onChange={handleChange}
                  required
                  value={bigOrder.date}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Ciudad"
                  name="cityId"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={bigOrder.cityId}
                >
                  <option value="">Seleccionar</option>
                  {cities.map((city) => (
                    <option
                      key={city._id}
                      value={city._id}
                    >
                      {city.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Plataforma"
                  name="platformId"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={bigOrder.platformId}
                >
                  <option value="">Seleccionar</option>
                  {platforms.map((platform) => (
                    <option
                      key={platform._id}
                      value={platform._id}
                    >
                      {platform.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider/>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Generar pedido
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
