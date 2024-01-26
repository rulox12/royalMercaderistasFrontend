import { useCallback, useState, useEffect, Fragment } from 'react';
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
import { getRoles } from 'src/services/roleService';
import { createUser } from 'src/services/userService';

const documentTypes = [
  {
    value: 'CC',
    label: 'Cedula'
  },
  {
    value: 'TI',
    label: 'Tarjeta de identidada'
  },
];

export const CustomersCreate = () => {
  const [user, setUser] = useState({
    document: '',
    documentType: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
    roleId: ''
  });
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const handleClick = (type,message) => {
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

  const [roles, setRoles] = useState([]);

  const getRolesService = async () => {
    try {
      const response = await getRoles();
      setRoles(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = useCallback(
    (event) => {
      setUser((prevState) => ({
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

  const handleSaveUser = async () => {
    try {
      const userWithPassword = {
        ...user,
        password: '123456',
      };
      const response = await createUser(userWithPassword);
      window.location.reload();
      handleClick('success','Usuario creado correctamente');
    } catch (error) {
      handleClick('error','Error al crear usuario');
      console.log('Error al guardar usuario:', error);
    }
  };

  useEffect(() => {
    getRolesService();
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
                  label="Tipo de documento"
                  name="documentType"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={user.documentType}
                >
                  {documentTypes.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
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
                  label="Documento"
                  name="document"
                  onChange={handleChange}
                  required
                  value={user.document}
                />
              </Grid>
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
                  value={user.name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Apellido"
                  name="surname"
                  onChange={handleChange}
                  required
                  value={user.surname}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Correo"
                  name="email"
                  onChange={handleChange}
                  required
                  value={user.email}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Celular"
                  name="phone"
                  onChange={handleChange}
                  required
                  type="number"
                  value={user.phone}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Rol"
                  name="roleId"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={user.roleId}
                >
                  {roles.map((role) => (
                    <option
                      key={role._id}
                      value={role._id}
                    >
                      {role.name}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained"
            onClick={handleSaveUser} >
            Guardar Usuario
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
