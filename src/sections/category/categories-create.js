import { useCallback, useState } from 'react';
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
import { createCategory } from 'src/services/categoryService';

export const CategoriesCreate = () => {
  const [category, setCategory] = useState({ name: '' });
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleChange = useCallback((event) => {
    setCategory((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      await createCategory(category);
      setAlertType('success');
      setAlertMessage('Categoría creada correctamente');
      setOpen(true);
      window.location.reload();
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error al crear categoría');
      setOpen(true);
    }
  }, [category]);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Card>
        <CardHeader subheader="Ingresa el nombre de la nueva categoría" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <TextField
                  fullWidth
                  label="Nombre de la categoría"
                  name="name"
                  onChange={handleChange}
                  required
                  value={category.name}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Guardar
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
