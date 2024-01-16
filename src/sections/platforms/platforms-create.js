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

import { createPlatform } from 'src/services/PlatformService';

export const PlatformsCreate = () => {
  const [platform, setPlatform] = useState({
    name: '',
    nit: '',
  });
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const handleClick = (type, message) => {
    setAlertType(type);
    setAlertMessage(message)
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
      setPlatform((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  const handleSavePlatform = async () => {
    try {
      const response = await createPlatform(platform);
      handleClick('success', 'Plataforma creada correctamente');
    } catch (error) {
      handleClick('error', 'Error al crear Platforma');
      console.log('Error al guardar Platforma:', error);
    }
  };

  useEffect(() => {
    
  }, []);

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Snackbar open={open}
        autoHideDuration={6000}
        onClose={handleClose}>
        <Alert onClose={handleClose}
          severity={alertType}
          sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Card>
        <CardHeader
          subheader=""
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Nombre"
                  name="name"
                  onChange={handleChange}
                  required
                  value={platform.name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="NIT"
                  name="nit"
                  onChange={handleChange}
                  required
                  value={platform.nit}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained"
            onClick={handleSavePlatform} >
            Guardar Plataforma
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
