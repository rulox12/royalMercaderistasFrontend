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
  Unstable_Grid2 as Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { getRoles } from 'src/services/roleService';
import { createUser, updateUser } from 'src/services/userService';

const documentTypes = [
  {
    value: 'CC',
    label: 'Cedula'
  },
  {
    value: 'TI',
    label: 'Tarjeta de identidada'
  }
];

export const CustomersCreate = ({ user: initialUser, isUpdate }) => {
  // En edición, siempre inicializar password a vacío para no sobrescribir
  const [user, setUser] = useState(() => {
    if (isUpdate && initialUser) {
      return {
        ...initialUser,
        password: '' // Nunca enviar contraseña en edición
      };
    }
    return initialUser || {
      document: '',
      documentType: '',
      name: '',
      surname: '',
      email: '',
      phone: '',
      roleId: '',
      password: '',
      canViewLocalDashboard: false
    };
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

  const handleCheckboxChange = useCallback(
    (event) => {
      setUser((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.checked
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
      if (isUpdate) {
        if (user.password === '') {
          delete user['password'];
        }
        await updateUser(user._id, user);
        handleClick('success', 'Usuario actualizado correctamente');
      } else {
        await createUser(user);
        handleClick('success', 'Usuario creado correctamente');
      }
      window.location.reload();
    } catch (error) {
      handleClick('error', 'Error al guardar usuario');
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
                  <option value="">Seleccionar</option>
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
                  <option value="">Seleccionar</option>
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
              <Grid
                xs={12}
                md={6}
              >
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 1.5,
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 56
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="canViewLocalDashboard"
                        checked={user.canViewLocalDashboard || false}
                        onChange={handleCheckboxChange}
                        size="small"
                      />
                    }
                    label="Acceso especial"
                    sx={{
                      m: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.88rem',
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required={!isUpdate}
                  helperText={isUpdate ? "Dejar en blanco para no cambiar" : ""}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider/>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained"
                  onClick={handleSaveUser}>
            Guardar Usuario
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
