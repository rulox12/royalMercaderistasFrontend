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
} from '@mui/material';
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

  const handleRun = async () => {
    setError('');
    setSuccess('');

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
      const steps = response?.steps?.map((step) => step.step).join(', ') || 'sales, received, rentability';
      setSuccess(`Proceso ejecutado correctamente (${steps}).`);
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
                    >
                      {loading ? 'Ejecutando...' : 'Ejecutar Full Process'}
                    </Button>
                  </Box>
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