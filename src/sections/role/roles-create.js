import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  TextField,
  Snackbar,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { createRole, updateRole } from 'src/services/roleService';
import { ALL_PERMISSION_VALUES, isAdminRole, PERMISSIONS } from 'src/utils/permissions';

export const RolesCreate = ({ roleToEdit = null, onSaved }) => {
  const [role, setRole] = useState({
    name: '',
    description: '',
    permissions: [],
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
      setRole((prevRole) => ({
        ...prevRole,
        [event.target.name]: event.target.value,
        ...(event.target.name === 'name' && isAdminRole({ name: event.target.value })
          ? { permissions: ALL_PERMISSION_VALUES }
          : {}),
      }));
    },
    []
  );

  const handlePermissionChange = useCallback((permission) => {
    setRole((prevRole) => {
      const permissions = prevRole.permissions || [];
      const nextPermissions = permissions.includes(permission)
        ? permissions.filter((item) => item !== permission)
        : [...permissions, permission];

      return {
        ...prevRole,
        permissions: nextPermissions,
      };
    });
  }, []);

  useEffect(() => {
    if (!roleToEdit) {
      setRole({ name: '', description: '', permissions: [] });
      return;
    }

    setRole({
      name: roleToEdit.name || '',
      description: roleToEdit.description || '',
      permissions: roleToEdit.permissions || [],
    });
  }, [roleToEdit]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        const rolePayload = isAdminRole(role)
          ? { ...role, permissions: ALL_PERMISSION_VALUES }
          : role;

        if (roleToEdit?._id) {
          await updateRole(roleToEdit._id, rolePayload);
          handleClick('success', 'Rol actualizado correctamente');
        } else {
          await createRole(rolePayload);
          handleClick('success', 'Rol creado correctamente');
        }

        if (onSaved) {
          onSaved();
        }
      } catch (error) {
        handleClick('error', 'Error guardando rol');
        console.log('Error saving role:', error);
      }
    },
    [onSaved, role, roleToEdit]
  );

  const adminRole = isAdminRole(role);


  return (
    <form autoComplete="off"
noValidate
onSubmit={handleSubmit}>
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
        <CardHeader subheader="" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container
spacing={3}>
              <Grid xs={12}
md={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="name"
                  onChange={handleChange}
                  required
                  value={role.name}
                />
              </Grid>
              <Grid xs={12}
md={6}>
                <TextField
                  fullWidth
                  label="Descripción"
                  name="description"
                  onChange={handleChange}
                  required
                  value={role.description}
                />
              </Grid>
              <Grid xs={12}>
                <FormGroup
                  sx={{
                    display: 'grid',
                    gap: 1,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                  }}
                >
                  {PERMISSIONS.map((permission) => (
                    <FormControlLabel
                      key={permission.value}
                      control={(
                        <Checkbox
                          checked={adminRole || (role.permissions || []).includes(permission.value)}
                          disabled={adminRole}
                          onChange={() => handlePermissionChange(permission.value)}
                        />
                      )}
                      label={permission.label}
                    />
                  ))}
                </FormGroup>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained"
onClick={handleSubmit}>
            {roleToEdit ? 'Actualizar Rol' : 'Guardar Rol'}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
