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
import { createCity } from 'src/services/cityService'; 

export const OrdersCreate = () => {
  const [city, setCity] = useState({
    name: '',
    department: '',
  });
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

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
      setCity((prevCity) => ({
        ...prevCity,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        const response = await createCity(city);
        handleClick('success', 'Ciudad creada correctamente');
        window.location.reload();
      } catch (error) {
        handleClick('error', 'Error creating city');
        console.log('Error saving city:', error);
      }
    },
    [city]
  );


  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Card>
        <CardHeader subheader="" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City Name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={city.name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  onChange={handleChange}
                  required
                  value={city.department}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSubmit}>
            Save City
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
