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
import { createShop } from 'src/services/shopService';
import { getPlatforms } from 'src/services/PlatformService';
import { getLists } from 'src/services/listService';
import { getUsers } from 'src/services/userService';
import { getCities } from 'src/services/cityService';

export const ShopsCreate = () => {
  const [shop, setShop] = useState({
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
      const response = await createShop(shop);
      handleClick('success', 'Tienda creada correctamente');
    } catch (error) {
      handleClick('error', 'Error al crear la tienda');
      console.log('Error al guardar la tienda:', error);
    }
  };

  useEffect(() => {
    getPlatformsService();
    getUserService();
    getListsService();
    getCitiesService();
  }, []);

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
                  required
                  value={shop.manager}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  onChange={handleChange}
                  required
                  value={shop.phone}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Jefe/Supervisor"
                  name="boss"
                  onChange={handleChange}
                  required
                  value={shop.boss}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono del jefe/supervisor"
                  name="bossPhone"
                  onChange={handleChange}
                  required
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
                  value={shop.cityId}
                >
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
                  value={shop.listId}
                >
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
                  value={shop.userId}
                >
                  {users.map((user) => (
                    <option
                      key={user._id}
                      value={user._id}
                    >
                      {user.name}
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