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
import * as XLSX from 'xlsx';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { getCategories, getCategorySalesSummary } from 'src/services/categoryService';
import { getCities } from 'src/services/cityService';
import { getPlatforms } from 'src/services/platformService';
import { getShops } from 'src/services/shopService';

const emptySummary = {
  totals: { unitsSold: 0, salesValue: 0, categoriesCount: 0 },
  categories: [],
};

const formatCurrency = (value) => new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
}).format(Number(value) || 0);

const formatNumber = (value) => new Intl.NumberFormat('es-CO').format(Number(value) || 0);

const formatDisplayDate = (dateString) => {
  if (!dateString) {
    return '';
  }

  const parsedDate = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('es-CO').format(parsedDate);
};

const toISODate = (date) => date.toISOString().split('T')[0];

const PERIODS = [
  { id: 1, name: 'Enero', startMonth: 0, startDay: 1, endMonth: 0, endDay: 25 },
  { id: 2, name: 'Febrero', startMonth: 0, startDay: 26, endMonth: 1, endDay: 25 },
  { id: 3, name: 'Marzo', startMonth: 1, startDay: 26, endMonth: 2, endDay: 25 },
  { id: 4, name: 'Abril', startMonth: 2, startDay: 26, endMonth: 3, endDay: 25 },
  { id: 5, name: 'Mayo', startMonth: 3, startDay: 26, endMonth: 4, endDay: 25 },
  { id: 6, name: 'Junio', startMonth: 4, startDay: 26, endMonth: 5, endDay: 25 },
  { id: 7, name: 'Julio', startMonth: 5, startDay: 26, endMonth: 6, endDay: 25 },
  { id: 8, name: 'Agosto', startMonth: 6, startDay: 26, endMonth: 7, endDay: 25 },
  { id: 9, name: 'Septiembre', startMonth: 7, startDay: 26, endMonth: 8, endDay: 25 },
  { id: 10, name: 'Octubre', startMonth: 8, startDay: 26, endMonth: 9, endDay: 25 },
  { id: 11, name: 'Noviembre', startMonth: 9, startDay: 26, endMonth: 10, endDay: 25 },
  { id: 12, name: 'Diciembre', startMonth: 10, startDay: 26, endMonth: 11, endDay: 25 },
  { id: 13, name: 'Fin Diciembre', startMonth: 11, startDay: 26, endMonth: 11, endDay: 31 },
];

const getCurrentPeriodId = (date = new Date()) => {
  const month = date.getMonth();
  const day = date.getDate();

  if (month === 0 && day <= 25) {
    return 1;
  }

  if (month === 11 && day >= 26) {
    return 13;
  }

  if (day >= 26) {
    return month + 2;
  }

  return month + 1;
};

const getPreviousPeriodSelection = (periodId, year) => {
  if (periodId === 1) {
    return { periodId: 13, year: year - 1 };
  }

  return { periodId: periodId - 1, year };
};

const buildPeriodRange = (periodId, year) => {
  const selectedPeriod = PERIODS.find((period) => period.id === periodId);

  if (!selectedPeriod) {
    return { startDate: '', endDate: '' };
  }

  const startDate = toISODate(new Date(Date.UTC(year, selectedPeriod.startMonth, selectedPeriod.startDay)));
  const endDate = toISODate(new Date(Date.UTC(year, selectedPeriod.endMonth, selectedPeriod.endDay)));

  return { startDate, endDate };
};

const formatPeriodOptionLabel = (period, year) => {
  const { startDate, endDate } = buildPeriodRange(period.id, year);
  const rangeLabel = startDate && endDate ? ` ${formatDisplayDate(startDate)} a ${formatDisplayDate(endDate)}` : '';

  return `${period.id}. ${period.name}${rangeLabel}`;
};

const renderSelectedName = (items, value, emptyLabel) => {
  if (!value) {
    return emptyLabel;
  }

  return items.find((item) => item._id === value)?.name || emptyLabel;
};

const calculateVariation = (currentValue, comparisonValue) => {
  if (!comparisonValue) {
    return currentValue ? 100 : 0;
  }

  return Number((((currentValue - comparisonValue) / comparisonValue) * 100).toFixed(2));
};

const formatPercent = (value) => `${formatNumber(value)}%`;

const sanitizeFileNamePart = (value) => String(value || 'todos')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9_-]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .toLowerCase();

const Page = () => {
  const referenceDate = new Date();
  referenceDate.setDate(referenceDate.getDate() - 2);

  const currentYear = referenceDate.getFullYear();
  const defaultPeriodId = getCurrentPeriodId(referenceDate);
  const defaultComparison = getPreviousPeriodSelection(defaultPeriodId, currentYear);
  const defaultCurrentRange = buildPeriodRange(defaultPeriodId, currentYear);
  const defaultComparisonRange = buildPeriodRange(defaultComparison.periodId, defaultComparison.year);

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriodId);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [comparisonPeriod, setComparisonPeriod] = useState(defaultComparison.periodId);
  const [comparisonYear, setComparisonYear] = useState(defaultComparison.year);
  const [startDate, setStartDate] = useState(defaultCurrentRange.startDate);
  const [endDate, setEndDate] = useState(defaultCurrentRange.endDate);
  const [comparisonStartDate, setComparisonStartDate] = useState(defaultComparisonRange.startDate);
  const [comparisonEndDate, setComparisonEndDate] = useState(defaultComparisonRange.endDate);
  const [currentSummary, setCurrentSummary] = useState(emptySummary);
  const [comparisonSummary, setComparisonSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [platformId, setPlatformId] = useState('');
  const [cityId, setCityId] = useState('');
  const [shopId, setShopId] = useState('');
  const [showDateFields, setShowDateFields] = useState(false);

  const yearOptions = useMemo(() => ([
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ]), [currentYear]);

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
    } catch (loadError) {
      console.error('Error cargando plataformas', loadError);
    }
  }, []);

  const loadCities = useCallback(async () => {
    try {
      const response = await getCities();
      setCities(response);
    } catch (loadError) {
      console.error('Error cargando ciudades', loadError);
    }
  }, []);

  const loadShops = useCallback(async () => {
    try {
      const response = await getShops();
      setShops(response);
    } catch (loadError) {
      console.error('Error cargando locales', loadError);
    }
  }, []);

  const loadSummary = useCallback(async () => {
    if (!startDate || !endDate || !comparisonStartDate || !comparisonEndDate) {
      return;
    }

    if (startDate > endDate || comparisonStartDate > comparisonEndDate) {
      setError('La fecha inicial no puede ser mayor a la fecha final en ninguno de los periodos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sharedFilters = {
        categoryId: selectedCategory,
        platformId,
        cityId,
        shopId,
      };
      const [currentResponse, comparisonResponse] = await Promise.all([
        getCategorySalesSummary({ startDate, endDate, ...sharedFilters }),
        getCategorySalesSummary({
          startDate: comparisonStartDate,
          endDate: comparisonEndDate,
          ...sharedFilters,
        }),
      ]);
      setCurrentSummary(currentResponse);
      setComparisonSummary(comparisonResponse);
    } catch (loadError) {
      setError('No fue posible cargar las ventas por categoría');
    } finally {
      setLoading(false);
    }
  }, [cityId, comparisonEndDate, comparisonStartDate, endDate, platformId, selectedCategory, shopId, startDate]);

  const handlePeriodChange = useCallback((periodId, year) => {
    const range = buildPeriodRange(periodId, year);
    setSelectedPeriod(periodId);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  }, []);

  const handleYearChange = useCallback((year) => {
    const range = buildPeriodRange(selectedPeriod, year);
    setSelectedYear(year);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  }, [selectedPeriod]);

  const handleComparisonPeriodChange = useCallback((periodId, year) => {
    const range = buildPeriodRange(periodId, year);
    setComparisonPeriod(periodId);
    setComparisonStartDate(range.startDate);
    setComparisonEndDate(range.endDate);
  }, []);

  const handleComparisonYearChange = useCallback((year) => {
    const range = buildPeriodRange(comparisonPeriod, year);
    setComparisonYear(year);
    setComparisonStartDate(range.startDate);
    setComparisonEndDate(range.endDate);
  }, [comparisonPeriod]);

  useEffect(() => {
    loadCategories();
    loadPlatforms();
    loadCities();
    loadShops();
  }, [loadCategories, loadCities, loadPlatforms, loadShops]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const filteredCities = useMemo(() => {
    if (!platformId) {
      return cities;
    }

    const cityIds = new Set(
      shops
        .filter((shop) => String(shop.platformId?._id || shop.platformId) === platformId)
        .map((shop) => String(shop.cityId?._id || shop.cityId))
    );

    return cities.filter((city) => cityIds.has(String(city._id)));
  }, [cities, platformId, shops]);

  const filteredShops = useMemo(() => shops.filter((shop) => {
    const shopPlatformId = String(shop.platformId?._id || shop.platformId || '');
    const shopCityId = String(shop.cityId?._id || shop.cityId || '');

    if (platformId && shopPlatformId !== platformId) {
      return false;
    }

    if (cityId && shopCityId !== cityId) {
      return false;
    }

    return true;
  }), [cityId, platformId, shops]);

  useEffect(() => {
    if (cityId && !filteredCities.some((city) => city._id === cityId)) {
      setCityId('');
    }
  }, [cityId, filteredCities]);

  useEffect(() => {
    if (shopId && !filteredShops.some((shop) => shop._id === shopId)) {
      setShopId('');
    }
  }, [filteredShops, shopId]);

  const comparisonRows = useMemo(() => {
    const rowsByCategory = new Map();

    (currentSummary.categories || []).forEach((item) => {
      rowsByCategory.set(item.categoryId, {
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        currentProductsCount: item.productsCount,
        currentUnitsSold: item.unitsSold,
        currentSalesValue: item.salesValue,
        comparisonProductsCount: 0,
        comparisonUnitsSold: 0,
        comparisonSalesValue: 0,
      });
    });

    (comparisonSummary.categories || []).forEach((item) => {
      const row = rowsByCategory.get(item.categoryId) || {
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        currentProductsCount: 0,
        currentUnitsSold: 0,
        currentSalesValue: 0,
      };

      rowsByCategory.set(item.categoryId, {
        ...row,
        comparisonProductsCount: item.productsCount,
        comparisonUnitsSold: item.unitsSold,
        comparisonSalesValue: item.salesValue,
      });
    });

    return Array.from(rowsByCategory.values())
      .map((row) => ({
        ...row,
        unitsVariation: calculateVariation(row.currentUnitsSold, row.comparisonUnitsSold),
        salesVariation: calculateVariation(row.currentSalesValue, row.comparisonSalesValue),
      }))
      .sort((a, b) => b.currentSalesValue - a.currentSalesValue);
  }, [comparisonSummary, currentSummary]);

  const periodCards = useMemo(() => ([
    {
      title: 'Periodo actual',
      range: `${startDate} a ${endDate}`,
      summary: currentSummary,
    },
    {
      title: 'Periodo comparativo',
      range: `${comparisonStartDate} a ${comparisonEndDate}`,
      summary: comparisonSummary,
    },
  ]), [comparisonEndDate, comparisonStartDate, comparisonSummary, currentSummary, endDate, startDate]);

  const selectedPeriodLabel = useMemo(() => {
    const period = PERIODS.find((item) => item.id === selectedPeriod);

    return period ? formatPeriodOptionLabel(period, selectedYear) : 'Periodo actual';
  }, [selectedPeriod, selectedYear]);

  const comparisonPeriodLabel = useMemo(() => {
    const period = PERIODS.find((item) => item.id === comparisonPeriod);

    return period ? formatPeriodOptionLabel(period, comparisonYear) : 'Periodo comparativo';
  }, [comparisonPeriod, comparisonYear]);

  const handleExport = useCallback(() => {
    if (!comparisonRows.length) {
      return;
    }

    const rows = comparisonRows.map((row) => ({
      Categoria: row.categoryName,
      'Productos vendidos actual': row.currentProductsCount,
      'Unidades actual': row.currentUnitsSold,
      'Valor actual': row.currentSalesValue,
      'Productos vendidos comparativo': row.comparisonProductsCount,
      'Unidades comparativo': row.comparisonUnitsSold,
      'Valor comparativo': row.comparisonSalesValue,
      'Variacion unidades %': row.unitsVariation,
      'Variacion valor %': row.salesVariation,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Categorias');

    const selectedPlatformName = platforms.find((platform) => platform._id === platformId)?.name || 'todas-plataformas';
    const selectedCityName = cities.find((city) => city._id === cityId)?.name || 'todas-ciudades';
    const selectedShopName = shops.find((shop) => shop._id === shopId)?.name || 'todos-locales';
    const fileName = `dashboard-categorias_${sanitizeFileNamePart(selectedPlatformName)}_${sanitizeFileNamePart(selectedCityName)}_${sanitizeFileNamePart(selectedShopName)}_${startDate}_${endDate}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  }, [cities, cityId, comparisonRows, endDate, platformId, platforms, shopId, shops, startDate]);

  return (
    <>
      <Head>
        <title>Ventas por categoría</title>
      </Head>
      <Box component="main"
sx={{ flexGrow: 1, py: 8 }}>
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
                  <FormControl fullWidth>
                    <InputLabel id="current-period-filter-label">Periodo actual</InputLabel>
                    <Select
                      labelId="current-period-filter-label"
                      value={selectedPeriod}
                      label="Periodo actual"
                      renderValue={() => selectedPeriodLabel}
                      onChange={(event) => handlePeriodChange(Number(event.target.value), selectedYear)}
                    >
                      {PERIODS.map((period) => (
                        <MenuItem
                          key={period.id}
                          value={period.id}
                        >
                          {formatPeriodOptionLabel(period, selectedYear)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="current-year-filter-label">Año actual</InputLabel>
                    <Select
                      labelId="current-year-filter-label"
                      value={selectedYear}
                      label="Año actual"
                      onChange={(event) => handleYearChange(Number(event.target.value))}
                    >
                      {yearOptions.map((year) => (
                        <MenuItem
                          key={year}
                          value={year}
                        >
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="comparison-period-filter-label">Periodo comparativo</InputLabel>
                    <Select
                      labelId="comparison-period-filter-label"
                      value={comparisonPeriod}
                      label="Periodo comparativo"
                      renderValue={() => comparisonPeriodLabel}
                      onChange={(event) => handleComparisonPeriodChange(Number(event.target.value), comparisonYear)}
                    >
                      {PERIODS.map((period) => (
                        <MenuItem
                          key={period.id}
                          value={period.id}
                        >
                          {formatPeriodOptionLabel(period, comparisonYear)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="comparison-year-filter-label">Año comparativo</InputLabel>
                    <Select
                      labelId="comparison-year-filter-label"
                      value={comparisonYear}
                      label="Año comparativo"
                      onChange={(event) => handleComparisonYearChange(Number(event.target.value))}
                    >
                      {yearOptions.map((year) => (
                        <MenuItem
                          key={year}
                          value={year}
                        >
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    color="inherit"
                    onClick={() => setShowDateFields((previous) => !previous)}
                    sx={{
                      gridColumn: '1 / -1',
                      minHeight: 32,
                      py: 0.5,
                      borderColor: 'divider',
                      color: 'text.secondary',
                      fontWeight: 600,
                    }}
                    variant="outlined"
                  >
                    {showDateFields ? 'Ocultar fechas manuales' : 'Editar fechas manuales'}
                  </Button>
                  {showDateFields ? (
                    <>
                      <TextField
                        label="Actual desde"
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Actual hasta"
                        type="date"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Comparativo desde"
                        type="date"
                        value={comparisonStartDate}
                        onChange={(event) => setComparisonStartDate(event.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Comparativo hasta"
                        type="date"
                        value={comparisonEndDate}
                        onChange={(event) => setComparisonEndDate(event.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </>
                  ) : null}
                  <FormControl fullWidth>
                    <InputLabel
                      id="platform-filter-label"
                      shrink
                    >
                      Plataforma
                    </InputLabel>
                    <Select
                      displayEmpty
                      labelId="platform-filter-label"
                      value={platformId}
                      label="Plataforma"
                      renderValue={(value) => renderSelectedName(platforms, value, 'Todas')}
                      onChange={(event) => setPlatformId(event.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      {platforms.map((platform) => (
                        <MenuItem key={platform._id}
value={platform._id}>
                          {platform.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel
                      id="city-filter-label"
                      shrink
                    >
                      Ciudad
                    </InputLabel>
                    <Select
                      displayEmpty
                      labelId="city-filter-label"
                      value={cityId}
                      label="Ciudad"
                      renderValue={(value) => renderSelectedName(cities, value, 'Todas')}
                      onChange={(event) => setCityId(event.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      {filteredCities.map((city) => (
                        <MenuItem key={city._id}
value={city._id}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel
                      id="shop-filter-label"
                      shrink
                    >
                      Local
                    </InputLabel>
                    <Select
                      displayEmpty
                      labelId="shop-filter-label"
                      value={shopId}
                      label="Local"
                      renderValue={(value) => renderSelectedName(shops, value, 'Todos')}
                      onChange={(event) => setShopId(event.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {filteredShops.map((shop) => (
                        <MenuItem key={shop._id}
value={shop._id}>
                          {shop.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel
                      id="category-filter-label"
                      shrink
                    >
                      Categoría
                    </InputLabel>
                    <Select
                      displayEmpty
                      labelId="category-filter-label"
                      value={selectedCategory}
                      label="Categoría"
                      renderValue={(value) => renderSelectedName(categories, value, 'Todas')}
                      onChange={(event) => setSelectedCategory(event.target.value)}
                    >
                      <MenuItem value="">Todas</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category._id}
value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }}
spacing={2}>
                  <Button variant="contained"
onClick={loadSummary}
disabled={loading}>
                    {loading ? 'Cargando...' : 'Consultar'}
                  </Button>
                  <Button variant="outlined"
onClick={handleExport}
disabled={!comparisonRows.length}>
                    Exportar a Excel
                  </Button>
                </Stack>

                {error ? <Alert severity="error">{error}</Alert> : null}

                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'repeat(2, minmax(0, 1fr))',
                    },
                  }}
                >
                  {periodCards.map((period) => (
                    <Card key={period.title}
variant="outlined"
sx={{ p: 2.5 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography color="text.secondary"
variant="overline">
                            {period.title}
                          </Typography>
                          <Typography variant="subtitle2">{period.range}</Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'grid',
                            gap: 2,
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
                          }}
                        >
                          <Box>
                            <Typography color="text.secondary"
variant="caption">Valor vendido</Typography>
                            <Typography variant="h6">{formatCurrency(period.summary.totals?.salesValue)}</Typography>
                          </Box>
                          <Box>
                            <Typography color="text.secondary"
variant="caption">Unidades</Typography>
                            <Typography variant="h6">{formatNumber(period.summary.totals?.unitsSold)}</Typography>
                          </Box>
                          <Box>
                            <Typography color="text.secondary"
variant="caption">Categorías</Typography>
                            <Typography variant="h6">{formatNumber(period.summary.totals?.categoriesCount)}</Typography>
                          </Box>
                        </Box>
                      </Stack>
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
                      <TableCell align="right">Unidades actual</TableCell>
                      <TableCell align="right">Unidades comparativo</TableCell>
                      <TableCell align="right">Var. unidades</TableCell>
                      <TableCell align="right">Valor actual</TableCell>
                      <TableCell align="right">Valor comparativo</TableCell>
                      <TableCell align="right">Var. valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {comparisonRows.length ? comparisonRows.map((item) => (
                      <TableRow hover
key={item.categoryId}>
                        <TableCell>{item.categoryName}</TableCell>
                        <TableCell align="right">{formatNumber(item.currentUnitsSold)}</TableCell>
                        <TableCell align="right">{formatNumber(item.comparisonUnitsSold)}</TableCell>
                        <TableCell align="right">{formatPercent(item.unitsVariation)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.currentSalesValue)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.comparisonSalesValue)}</TableCell>
                        <TableCell align="right">{formatPercent(item.salesVariation)}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell align="center"
colSpan={7}>
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