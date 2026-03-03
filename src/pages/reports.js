import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useState, useEffect } from 'react';
import { getShops } from 'src/services/shopService';
import { getDateRangeComparison } from 'src/services/reportService';
import { ComparisonPieAlt } from 'src/sections/report/ComparisonPie';

const Page = () => {
  const today = new Date().toISOString().split('T')[0];
  
  // Calcular fechas por defecto
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Periodo A: mes anterior completo
  const prevMonthStart = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
  const prevMonthEnd = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];
  
  // Periodo B: del 1 del mes actual hasta hoy
  const currentMonthStart = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
  const currentMonthEnd = today;
  
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [startDateA, setStartDateA] = useState(prevMonthStart);
  const [endDateA, setEndDateA] = useState(prevMonthEnd);
  const [startDateB, setStartDateB] = useState(currentMonthStart);
  const [endDateB, setEndDateB] = useState(currentMonthEnd);
  const [reportData, setReportData] = useState(null);

  const fetchShops = async () => {
    try {
      const response = await getShops();
      setShops(response);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const fetchReport = async () => {
    if (!selectedShop || !startDateA || !endDateA || !startDateB || !endDateB) {
      return;
    }

    if (startDateA > endDateA || startDateB > endDateB) {
      console.error('Rango de fechas inválido: la fecha desde no puede ser mayor que la fecha hasta');
      return;
    }

    try {
      const response = await getDateRangeComparison(
        selectedShop,
        startDateA,
        endDateA,
        startDateB,
        endDateB
      );
      setReportData(response);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const normalizeData = (data = []) =>
    data.map(item => ({
      _id: {
        startDate: item._id?.startDate || '',
        endDate: item._id?.endDate || ''
      },
      ventas: Number(item.ventas) || 0,
      averias: Number(item.averias) || 0,
      rentabilidad: Number(item.rentabilidad) || 0
    }));

  const formatLabelDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(`${date}T00:00:00`));
  };

  const getRangeLabel = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return 'Periodo';
    }
    if (startDate === endDate) {
      return formatLabelDate(startDate);
    }
    return `${formatLabelDate(startDate)} - ${formatLabelDate(endDate)}`;
  };

  const periodLabels = ['Periodo A', 'Periodo B'];
  const periodATitle = `PERIODO A: ${getRangeLabel(startDateA, endDateA)}`;
  const periodBTitle = `PERIODO B: ${getRangeLabel(startDateB, endDateB)}`;

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <>
      <Head>
        <title>Reporte de Comparación</title>
      </Head>
      <Box
        component="main"
        sx={{ flexGrow: 1, py: 8 }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Comparar Ventas, Averías y Rentabilidad</Typography>

            {/* Select de Tienda */}
            <FormControl sx={{ width: 250 }}>
              <InputLabel id="shop-select-label">Tienda</InputLabel>
              <Select
                labelId="shop-select-label"
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
              >
                <MenuItem value="">
                  <em>Seleccione una tienda</em>
                </MenuItem>
                {shops.map((shop) => (
                  <MenuItem
                    key={shop._id}
                    value={shop._id}
                  >
                    {shop.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Rango A */}
            <Stack
              direction="row"
              spacing={2}
            >
              <FormControl sx={{ width: 220 }}>
                <TextField
                  label="Desde A"
                  type="date"
                  value={startDateA}
                  onChange={(e) => setStartDateA(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <FormControl sx={{ width: 220 }}>
                <TextField
                  label="Hasta A"
                  type="date"
                  value={endDateA}
                  onChange={(e) => setEndDateA(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Stack>

            {/* Rango B */}
            <Stack
              direction="row"
              spacing={2}
            >
              <FormControl sx={{ width: 220 }}>
                <TextField
                  label="Desde B"
                  type="date"
                  value={startDateB}
                  onChange={(e) => setStartDateB(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <FormControl sx={{ width: 220 }}>
                <TextField
                  label="Hasta B"
                  type="date"
                  value={endDateB}
                  onChange={(e) => setEndDateB(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Stack>

            <Button
              variant="contained"
              onClick={fetchReport}
            >
              Comparar
            </Button>

            {/* Títulos de períodos */}
            {reportData && (
              <Box sx={{
                mt: 4,
                mb: 4,
                display: 'flex',
                gap: 3,
                flexWrap: 'wrap'
              }}>
                <Box sx={{
                  flex: 1,
                  minWidth: 250,
                  p: 2,
                  bgcolor: '#e3f2fd',
                  borderLeft: '4px solid #1976d2',
                  borderRadius: 1
                }}>
                  <Typography
                    variant="caption"
                    sx={{ color: '#1976d2', fontWeight: 600, textTransform: 'uppercase' }}
                  >
                    Período A
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: '#424242', mt: 0.5 }}
                  >
                    {getRangeLabel(startDateA, endDateA)}
                  </Typography>
                </Box>
                <Box sx={{
                  flex: 1,
                  minWidth: 250,
                  p: 2,
                  bgcolor: '#f3e5f5',
                  borderLeft: '4px solid #7b1fa2',
                  borderRadius: 1
                }}>
                  <Typography
                    variant="caption"
                    sx={{ color: '#7b1fa2', fontWeight: 600, textTransform: 'uppercase' }}
                  >
                    Período B
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: '#424242', mt: 0.5 }}
                  >
                    {getRangeLabel(startDateB, endDateB)}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Gráficos */}
            {reportData && (
              <Stack
                direction="row"
                spacing={4}
                justifyContent="center"
                flexWrap="wrap"
              >
                <ComparisonPieAlt
                  data={normalizeData(reportData)}
                  metric="ventas"
                  periodLabels={periodLabels}
                />
                <ComparisonPieAlt
                  data={normalizeData(reportData)}
                  metric="averias"
                  periodLabels={periodLabels}
                />
                <ComparisonPieAlt
                  data={normalizeData(reportData)}
                  metric="rentabilidad"
                  periodLabels={periodLabels}
                />
              </Stack>
            )}
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