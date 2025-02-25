import { useState, useEffect } from 'react';
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
import { createShop, updateShop } from 'src/services/shopService';
import { getPlatforms } from 'src/services/platformService';
import { getLists } from 'src/services/listService';
import { getUsers } from 'src/services/userService';
import { getCities } from 'src/services/cityService';

export const ShopsCreate = ({ shop: initialShop, isUpdate }) => {
  const [shop, setShop] = useState(initialShop || {
    shopNumber: '',
    name: '',
    address: '',
    manager: '',
    phone: '',
    boss: '',
    bossPhone: '',
    platformId: '',
    cityId: '',
    listId: '',
    userId: ''
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

  const [users, setUsers] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [lists, setLists] = useState([]);
  const [cities, setCities] = useState([]);

  const getUserService = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const getListsService = async () => {
    try {
      const response = await getLists();
      setLists(response);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const getCitiesService = async () => {
    try {
      const response = await getCities();
      setCities(response);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleChange = (event) => {
    setShop({
      ...shop,
      [event.target.name]: event.target.value
    });
  };

  const handleSaveShop = async () => {
    try {
      if (isUpdate) {
        console.log('Este es el shop',shop)
        await updateShop(shop._id, shop);
        handleClick('success', 'Local actualizado correctamente');
      } else {
        await createShop(shop);
        handleClick('success', 'Local creado correctamente');
      }
      window.location.reload();
    } catch (error) {
      handleClick('error', 'Error al guardar local');
      console.log('Error al guardar local:', error);
    }
  };

  useEffect(() => {
    getPlatformsService();
    getUserService();
    getListsService();
    getCitiesService();
    if (isUpdate) {
      setShop(initialShop);
    }
  }, [initialShop, isUpdate]);

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={(event) => event.preventDefault()}
    >
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Card>
        <CardHeader
          subheader=""
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Número de tienda"
                  name="shopNumber"
                  onChange={handleChange}
                  required
                  value={shop.shopNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre de la tienda"
                  name="name"
                  onChange={handleChange}
                  required
                  value={shop.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  name="address"
                  onChange={handleChange}
                  required
                  value={shop.address}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Gerente"
                  name="manager"
                  onChange={handleChange}
                  value={shop.manager}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  onChange={handleChange}
                  value={shop.phone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Jefe/Supervisor"
                  name="boss"
                  onChange={handleChange}
                  value={shop.boss}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono del jefe/supervisor"
                  name="bossPhone"
                  onChange={handleChange}
                  value={shop.bossPhone}
                />
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
                  value={shop.platformId}
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
                  value={shop.cityId._id}
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
                  label="Lista"
                  name="listId"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={shop.listId._id}
                >
                  <option value="">Seleccionar</option>
                  {lists.map((list) => (
                    <option
                      key={list._id}
                      value={list._id}
                    >
                      {list.name}
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
                  label="Mercaderista"
                  name="userId"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={shop.userId._id}
                >
                  <option value="">Seleccionar</option>
                  {users.map((user) => (
                    <option
                      key={user._id}
                      value={user._id}
                    >
                      {user.name + ' ' + user.surname}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSaveShop}>
            Guardar Tienda
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
