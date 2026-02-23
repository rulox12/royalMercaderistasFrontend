import Head from 'next/head';
import {
  Box, Container, Stack, Typography,
  FormControl, InputLabel, Select, MenuItem, Button
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useState } from 'react';
import { getPlatformComparison } from 'src/services/reportService';
import { PlatformPie } from 'src/sections/report/PlatformPie';

const monthNames = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

const PlatformComparisonPage = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [reportData, setReportData] = useState(null);

  const fetchReport = async () => {
    if (!month || !year) return;
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0, 23, 59, 59, 999).toISOString();
    try {
      const response = await getPlatformComparison(startDate, endDate);
      setReportData(response);
    } catch (error) {
      console.error('Error fetching platform report:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Reporte por Plataformas</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Comparar Plataformas</Typography>

            {/* Select Mes/Año */}
            <Stack direction="row" spacing={2}>
              <FormControl sx={{ width: 150 }}>
                <InputLabel id="month-label">Mes</InputLabel>
                <Select
                  labelId="month-label"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {monthNames.map((m, i) => (
                    <MenuItem key={i} value={i + 1}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 150 }}>
                <InputLabel id="year-label">Año</InputLabel>
                <Select
                  labelId="year-label"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <MenuItem value={2023}>2023</MenuItem>
                  <MenuItem value={2024}>2024</MenuItem>
                  <MenuItem value={2025}>2025</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Button variant="contained" onClick={fetchReport}>
              Generar Reporte
            </Button>

            {/* Gráficos */}
            {reportData && (
              <Stack direction="row" spacing={4} justifyContent="center" flexWrap="wrap">
                <PlatformPie data={reportData} metric="ventas" />
                <PlatformPie data={reportData} metric="averias" />
                <PlatformPie data={reportData} metric="rentabilidad" />
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

PlatformComparisonPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PlatformComparisonPage;