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
  Button
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useState, useEffect } from 'react';
import { getShops } from 'src/services/shopService';
import { getMonthlyComparison } from 'src/services/reportService';
import { ComparisonPie } from 'src/sections/report/ComparisonPie';

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const Page = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [monthA, setMonthA] = useState('');
  const [yearA, setYearA] = useState('');
  const [monthB, setMonthB] = useState('');
  const [yearB, setYearB] = useState('');
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
    if (!selectedShop || !monthA || !yearA || !monthB || !yearB) {
      return;
    }
    try {
      const response = await getMonthlyComparison(selectedShop, monthA, yearA, monthB, yearB);
      setReportData(response);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const normalizeData = (data = []) =>
    data.map(item => ({
      _id: {
        year: item._id?.year ? Number(item._id.year) : 0,
        month: item._id?.month ? Number(item._id.month) : 0
      },
      ventas: Number(item.ventas) || 0,
      averias: Number(item.averias) || 0,
      rentabilidad: Number(item.rentabilidad) || 0
    }));

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <>
      <Head>
        <title>Reporte de Comparación</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
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
                  <MenuItem key={shop._id} value={shop._id}>
                    {shop.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Select Mes/Año A */}
            <Stack direction="row" spacing={2}>
              <FormControl sx={{ width: 150 }}>
                <InputLabel id="monthA-label">Mes A</InputLabel>
                <Select
                  labelId="monthA-label"
                  value={monthA}
                  onChange={(e) => setMonthA(e.target.value)}
                >
                  {monthNames.map((m, i) => (
                    <MenuItem key={i} value={i + 1}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 150 }}>
                <InputLabel id="yearA-label">Año A</InputLabel>
                <Select
                  labelId="yearA-label"
                  value={yearA}
                  onChange={(e) => setYearA(e.target.value)}
                >
                  <MenuItem value={2023}>2023</MenuItem>
                  <MenuItem value={2024}>2024</MenuItem>
                  <MenuItem value={2025}>2025</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Select Mes/Año B */}
            <Stack direction="row" spacing={2}>
              <FormControl sx={{ width: 150 }}>
                <InputLabel id="monthB-label">Mes B</InputLabel>
                <Select
                  labelId="monthB-label"
                  value={monthB}
                  onChange={(e) => setMonthB(e.target.value)}
                >
                  {monthNames.map((m, i) => (
                    <MenuItem key={i} value={i + 1}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 150 }}>
                <InputLabel id="yearB-label">Año B</InputLabel>
                <Select
                  labelId="yearB-label"
                  value={yearB}
                  onChange={(e) => setYearB(e.target.value)}
                >
                  <MenuItem value={2023}>2023</MenuItem>
                  <MenuItem value={2024}>2024</MenuItem>
                  <MenuItem value={2025}>2025</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Button variant="contained" onClick={fetchReport}>
              Comparar
            </Button>

            {/* Gráficos */}
            {reportData && (
              <Stack direction="row" spacing={4} justifyContent="center" flexWrap="wrap">
                <ComparisonPie data={normalizeData(reportData)} metric="ventas"/>
                <ComparisonPie data={normalizeData(reportData)} metric="averias"/>
                <ComparisonPie data={normalizeData(reportData)} metric="rentabilidad"/>
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