import Head from 'next/head';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { getCategories, getCategorySalesSummary } from 'src/services/categoryService';
import { getPlatformCitiesComparison } from 'src/services/reportService';
import { getPlatforms } from 'src/services/platformService';

const formatCurrency = (value) => new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
}).format(Number(value) || 0);

const formatNumber = (value) => new Intl.NumberFormat('es-CO').format(Number(value) || 0);

const Page = () => {
  const toISODate = (date) => date.toISOString().split('T')[0];

  const referenceDate = new Date();
  referenceDate.setDate(referenceDate.getDate() - 2);

  const currentDay = referenceDate.getDate();
  const currentMonth = referenceDate.getMonth();
  const currentYear = referenceDate.getFullYear();

  const defaultStartDate = currentDay >= 26
    ? new Date(currentYear, currentMonth, 26)
    : new Date(currentYear, currentMonth - 1, 26);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState(toISODate(defaultStartDate));
  const [endDate, setEndDate] = useState(toISODate(referenceDate));
  const [summary, setSummary] = useState({ totals: { unitsSold: 0, salesValue: 0, categoriesCount: 0 }, categories: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [platformId, setPlatformId] = useState('');
  const [platformTotals, setPlatformTotals] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (loadError) {
      setError('No fue posible cargar las categorías');
    }
  }, []);

  const loadPlatforms = useCallback(async () => {
    try {
      const response = await getPlatforms();
      setPlatforms(response);
      if (response.length > 0) setPlatformId(response[0]._id);
    } catch (loadError) {
      console.error('Error cargando plataformas', loadError);
    }
  }, []);

  const loadPlatformTotals = useCallback(async () => {
    if (!platformId || !startDate || !endDate || selectedCategory) {
      setPlatformTotals(null);
      return;
    }
    try {
      const response = await getPlatformCitiesComparison(
        platformId,
        startDate, endDate,
        startDate, endDate
      );
      const totals = (response || []).reduce(
        (acc, city) => {
          acc.ventasValor += Number(city?.monthB?.ventasValor) || 0;
          acc.ventasCantidad += Number(city?.monthB?.ventasCantidad) || 0;
          return acc;
        },
        { ventasValor: 0, ventasCantidad: 0 }
      );
      setPlatformTotals(totals);
    } catch (loadError) {
      console.error('Error cargando totales de plataforma', loadError);
      setPlatformTotals(null);
    }
  }, [platformId, startDate, endDate, selectedCategory]);

  const loadSummary = useCallback(async () => {
    if (!startDate || !endDate) {
      return;
    }

    if (startDate > endDate) {
      setError('La fecha inicial no puede ser mayor a la fecha final');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await getCategorySalesSummary({
        startDate,
        endDate,
        categoryId: selectedCategory,
      });
      setSummary(response);
    } catch (loadError) {
      setError('No fue posible cargar las ventas por categoría');
    } finally {
      setLoading(false);
    }
  }, [endDate, selectedCategory, startDate]);

  useEffect(() => {
    loadCategories();
    loadPlatforms();
  }, [loadCategories, loadPlatforms]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadPlatformTotals();
  }, [loadPlatformTotals]);

  const cards = useMemo(() => ([
    {
      title: 'Valor vendido',
      value: formatCurrency(summary.totals?.salesValue),
    },
    {
      title: 'Unidades vendidas',
      value: formatNumber(summary.totals?.unitsSold),
    },
    {
      title: 'Categorías con ventas',
      value: formatNumber(summary.totals?.categoriesCount),
    },
  ]), [summary]);

  return (
    <>
      <Head>
        <title>Ventas por categoría</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Ventas agrupadas por categoría</Typography>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'repeat(4, minmax(0, 1fr))',
                    },
                  }}
                >
                  <TextField
                    label="Desde"
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Hasta"
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="category-filter-label">Categoría</InputLabel>
                    <Select
                      labelId="category-filter-label"
                      value={selectedCategory}
                      label="Categoría"
                      onChange={(event) => setSelectedCategory(event.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" onClick={loadSummary} disabled={loading}>
                    {loading ? 'Cargando...' : 'Consultar'}
                  </Button>
                </Box>

                {error ? <Alert severity="error">{error}</Alert> : null}

                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'repeat(3, minmax(0, 1fr))',
                    },
                  }}
                >
                  {cards.map((card) => (
                    <Card key={card.title} variant="outlined" sx={{ p: 2.5 }}>
                      <Typography color="text.secondary" variant="overline">
                        {card.title}
                      </Typography>
                      <Typography sx={{ mt: 1 }} variant="h5">
                        {card.value}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              </Stack>
            </Card>
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Categoría</TableCell>
                      <TableCell align="right">Productos vendidos</TableCell>
                      <TableCell align="right">Unidades vendidas</TableCell>
                      <TableCell align="right">Valor vendido</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summary.categories?.length ? summary.categories.map((item) => (
                      <TableRow hover key={item.categoryId}>
                        <TableCell>{item.categoryName}</TableCell>
                        <TableCell align="right">{formatNumber(item.productsCount)}</TableCell>
                        <TableCell align="right">{formatNumber(item.unitsSold)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.salesValue)}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell align="center" colSpan={4}>
                          No hay ventas para el rango seleccionado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;