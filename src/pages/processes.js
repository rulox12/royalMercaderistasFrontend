import Head from 'next/head';
import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { runFullProcess } from 'src/services/processService';

const toISODate = (date) => date.toISOString().split('T')[0];

const getDefaultRange = () => {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let startDate;
  let endDate;

  if (currentDay <= 25) {
    startDate = new Date(currentYear, currentMonth - 1, 26);
    endDate = new Date(currentYear, currentMonth, 25);
  } else {
    startDate = new Date(currentYear, currentMonth, 26);
    const nextCutoffDate = new Date(currentYear, currentMonth + 1, 25);
    endDate = now < nextCutoffDate ? now : nextCutoffDate;
  }

  return {
    startDate: toISODate(startDate),
    endDate: toISODate(endDate),
  };
};

const Page = () => {
  const defaults = useMemo(() => getDefaultRange(), []);
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState(null);

  const handleRun = async () => {
    setError('');
    setSuccess('');
    setResult(null);

    if (!startDate || !endDate) {
      setError('Debes ingresar fecha inicio y fecha fin');
      return;
    }

    if (startDate > endDate) {
      setError('La fecha inicio debe ser menor o igual a la fecha fin');
      return;
    }

    setLoading(true);
    try {
      const response = await runFullProcess(startDate, endDate);
      setResult(response);
      setSuccess(`✅ ${response.summary.message}`);
    } catch (runError) {
      setError(runError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Procesos | Royal fruit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3}>
            <Typography variant="h4">Procesos</Typography>

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">Full Process</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Ejecuta secuencialmente: ventas, recibidas y rentabilidad para el rango seleccionado.
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Fecha inicio"
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      label="Fecha fin"
                      type="date"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>

                  {error ? <Alert severity="error">{error}</Alert> : null}
                  {success ? <Alert severity="success">{success}</Alert> : null}

                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleRun}
                      disabled={loading}
                      fullWidth
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Ejecutando...
                        </>
                      ) : (
                        'Ejecutar Full Process'
                      )}
                    </Button>
                  </Box>

                  {result && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                        Detalle de ejecución:
                      </Typography>
                      <List>
                        {result.steps.map((step, idx) => (
                          <ListItem
                            key={idx}
                            sx={{
                              py: 1.5,
                              px: 1.5,
                              bgcolor: step.ok ? '#f1f8f4' : '#fdf0f0',
                              mb: 1,
                              borderRadius: 1,
                              border: `1px solid ${step.ok ? '#c8e6c9' : '#ffcdd2'}`,
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              {step.ok ? (
                                <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
                              ) : (
                                <ErrorIcon sx={{ color: '#c62828', fontSize: 28 }} />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                  {step.step.charAt(0).toUpperCase() + step.step.slice(1)}: {step.status}
                                </Typography>
                              }
                              secondary={
                                step.error ? (
                                  <Typography variant="caption" sx={{ color: '#c62828', display: 'block' }}>
                                    {step.error}
                                  </Typography>
                                ) : step.stdout ? (
                                  <Typography variant="caption" sx={{ color: '#616161', display: 'block', fontSize: '0.75rem' }}>
                                    {step.stdout.substring(0, 120)}
                                    {step.stdout.length > 120 ? '...' : ''}
                                  </Typography>
                                ) : null
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;