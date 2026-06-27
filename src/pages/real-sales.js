import Head from 'next/head';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
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
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { getPlatforms } from 'src/services/platformService';
import { getCities } from 'src/services/cityService';
import { getShops } from 'src/services/shopService';
import {
  createRealSale,
  getRealSaleFormData,
  updateRealSale,
} from 'src/services/realSaleService';

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const calculatePercent = (realSale, calculatedSale) => {
  if (!calculatedSale) {
    return 0;
  }

  return Number((((realSale - calculatedSale) / calculatedSale) * 100).toFixed(2));
};

const formatNumber = (value) => new Intl.NumberFormat('es-CO').format(toNumber(value));

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

const getCurrentPeriodId = () => {
  const currentDate = new Date();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

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

const buildPeriodRange = (periodId, year) => {
  const selectedPeriod = PERIODS.find((period) => period.id === periodId);

  if (!selectedPeriod) {
    return { startDate: '', endDate: '' };
  }

  const startDate = toISODate(new Date(Date.UTC(year, selectedPeriod.startMonth, selectedPeriod.startDay)));
  const endDate = toISODate(new Date(Date.UTC(year, selectedPeriod.endMonth, selectedPeriod.endDay)));

  return { startDate, endDate };
};

const distributeCalculatedSaleByRealWeight = (category, categoryCalculatedSaleValue) => {
  const products = category.products || [];
  const totalRealSale = products.reduce((sum, product) => sum + toNumber(product.realSale), 0);
  const categoryCalculatedSale = Math.max(0, Math.round(toNumber(categoryCalculatedSaleValue)));

  let allocatedByProductId = {};

  if (products.length > 0) {
    if (totalRealSale > 0) {
      const weighted = products.map((product) => {
        const productRealSale = toNumber(product.realSale);
        const raw = (productRealSale / totalRealSale) * categoryCalculatedSale;
        const base = Math.floor(raw);
        return {
          productId: product._id,
          raw,
          base,
          fraction: raw - base,
        };
      });

      const baseSum = weighted.reduce((sum, item) => sum + item.base, 0);
      let remainder = categoryCalculatedSale - baseSum;

      weighted.sort((a, b) => b.fraction - a.fraction);

      weighted.forEach((item, index) => {
        allocatedByProductId[item.productId] = item.base + (index < remainder ? 1 : 0);
      });
    } else {
      const base = Math.floor(categoryCalculatedSale / products.length);
      let remainder = categoryCalculatedSale - (base * products.length);

      products.forEach((product) => {
        const extra = remainder > 0 ? 1 : 0;
        allocatedByProductId[product._id] = base + extra;
        remainder -= extra;
      });
    }
  }

  const distributedProducts = products.map((product) => {
    const productRealSale = toNumber(product.realSale);
    const productCalculatedSale = allocatedByProductId[product._id] || 0;
    const unitDifference = productRealSale - productCalculatedSale;

    return {
      ...product,
      calculatedSale: productCalculatedSale,
      unitDifference,
      percentageDifference: calculatePercent(productRealSale, productCalculatedSale),
    };
  });

  const categoryRealSale = toNumber(category.realSale);
  const categoryUnitDifference = categoryRealSale - categoryCalculatedSale;

  return {
    ...category,
    calculatedSale: categoryCalculatedSale,
    unitDifference: categoryUnitDifference,
    percentageDifference: calculatePercent(categoryRealSale, categoryCalculatedSale),
    products: distributedProducts,
  };
};

const Page = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentPeriodId());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const yearOptions = useMemo(() => [currentYear - 1, currentYear, currentYear + 1], [currentYear]);

  const [platforms, setPlatforms] = useState([]);
  const [cities, setCities] = useState([]);
  const [shops, setShops] = useState([]);

  const [platformId, setPlatformId] = useState('');
  const [cityId, setCityId] = useState('');
  const [shopId, setShopId] = useState('');

  const [categories, setCategories] = useState([]);
  const [existingRealSaleId, setExistingRealSaleId] = useState(null);
  const [showOrderedProducts, setShowOrderedProducts] = useState(false);

  const [loadingFilters, setLoadingFilters] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification((previous) => ({
      ...previous,
      open: false,
    }));
  }, []);

  const orderedProducts = useMemo(() => {
    return categories
      .flatMap((category) => (category.products || []).map((product) => ({
        ...product,
        categoryName: category.name,
      })))
      .sort((a, b) => {
        const positionA = toNumber(a.position);
        const positionB = toNumber(b.position);

        if (positionA !== positionB) {
          return positionA - positionB;
        }

        return String(a.displayName || a.name).localeCompare(String(b.displayName || b.name));
      });
  }, [categories]);

  const handleExportOrderedProducts = useCallback(() => {
    if (!orderedProducts.length || typeof window === 'undefined') {
      return;
    }

    const rows = orderedProducts.map((product) => ({
      Posición: toNumber(product.position),
      Producto: product.displayName || product.name || '',
      Categoría: product.categoryName || '',
      'Venta real': toNumber(product.realSale),
      'Venta calculada': toNumber(product.calculatedSale),
      'Dif. unidades': toNumber(product.unitDifference),
      'Dif. %': toNumber(product.percentageDifference),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    worksheet['!cols'] = [
      { wch: 12 },
      { wch: 32 },
      { wch: 24 },
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 10 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos en orden');
    XLSX.writeFile(workbook, 'productos-en-orden.xlsx');
  }, [orderedProducts]);

  const loadFiltersData = useCallback(async () => {
    setLoadingFilters(true);
    setError('');

    try {
      const [platformsResponse, citiesResponse] = await Promise.all([
        getPlatforms(),
        getCities(),
      ]);

      setPlatforms(platformsResponse || []);
      setCities(citiesResponse || []);
    } catch (loadError) {
      setError('No fue posible cargar plataformas y ciudades.');
    } finally {
      setLoadingFilters(false);
    }
  }, []);

  const loadShopsData = useCallback(async () => {
    if (!platformId || !cityId) {
      setShops([]);
      setShopId('');
      return;
    }

    try {
      const response = await getShops({ platformId, cityId });
      setShops(response || []);

      if (shopId && !(response || []).some((shop) => shop._id === shopId)) {
        setShopId('');
      }
    } catch (loadError) {
      setError('No fue posible cargar los locales para esa plataforma y ciudad.');
      setShops([]);
      setShopId('');
    }
  }, [platformId, cityId, shopId]);

  const handleLoadRealSalesData = useCallback(async () => {
    if (!platformId || !cityId || !shopId || !startDate || !endDate) {
      setError('Debes seleccionar plataforma, ciudad, local y periodo.');
      return;
    }

    if (startDate > endDate) {
      setError('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return;
    }

    setLoadingData(true);
    setError('');

    try {
      const response = await getRealSaleFormData({
        platformId,
        cityId,
        shopId,
        startDate,
        endDate,
      });

      setExistingRealSaleId(response.existingRealSaleId || null);
      setCategories((response.categories || []).map((category) => {
        const initialCategoryCalculated = toNumber(category.calculatedSale);
        return distributeCalculatedSaleByRealWeight(category, initialCategoryCalculated);
      }));
    } catch (loadError) {
      setError('No fue posible cargar las categorías y ventas reales para el rango seleccionado.');
    } finally {
      setLoadingData(false);
    }
  }, [platformId, cityId, shopId, startDate, endDate]);

  const handleCategoryCalculatedSaleChange = (categoryId, rawValue) => {
    const newCategoryCalculatedSale = rawValue === '' ? 0 : Math.round(toNumber(rawValue));

    setCategories((previousCategories) => previousCategories.map((category) => {
      if (category._id !== categoryId) {
        return category;
      }

      return distributeCalculatedSaleByRealWeight(category, newCategoryCalculatedSale);
    }));
  };

  const handleSave = useCallback(async () => {
    if (!platformId || !cityId || !shopId || !startDate || !endDate) {
      setError('Completa plataforma, ciudad, local y periodo antes de guardar.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      platformId,
      cityId,
      shopId,
      startDate,
      endDate,
      categories: categories.map((category) => ({
        categoryId: category._id,
        realSale: toNumber(category.realSale),
        calculatedSale: toNumber(category.calculatedSale),
        unitDifference: toNumber(category.unitDifference),
        percentageDifference: toNumber(category.percentageDifference),
        products: (category.products || []).map((product) => ({
          productId: product._id,
          realSale: toNumber(product.realSale),
          calculatedSale: toNumber(product.calculatedSale),
          unitDifference: toNumber(product.unitDifference),
          percentageDifference: toNumber(product.percentageDifference),
        })),
      })),
    };

    try {
      if (existingRealSaleId) {
        await updateRealSale(existingRealSaleId, payload);
        showNotification('Ventas reales actualizadas correctamente.', 'success');
      } else {
        const created = await createRealSale(payload);
        setExistingRealSaleId(created?._id || null);
        showNotification('Ventas reales guardadas correctamente.', 'success');
      }
    } catch (saveError) {
      setError('No fue posible guardar la información de ventas reales.');
      showNotification('Error al guardar ventas reales.', 'error');
    } finally {
      setSaving(false);
    }
  }, [
    categories,
    cityId,
    endDate,
    existingRealSaleId,
    platformId,
    shopId,
    showNotification,
    startDate,
  ]);

  useEffect(() => {
    loadFiltersData();
  }, [loadFiltersData]);

  useEffect(() => {
    loadShopsData();
  }, [loadShopsData]);

  useEffect(() => {
    const range = buildPeriodRange(selectedPeriod, selectedYear);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    setCategories([]);
    setExistingRealSaleId(null);
    setShowOrderedProducts(false);
  }, [selectedPeriod, selectedYear]);

  useEffect(() => {
    if (!platformId || !cityId || !shopId || !startDate || !endDate) {
      return;
    }

    handleLoadRealSalesData();
  }, [platformId, cityId, shopId, startDate, endDate, handleLoadRealSalesData]);

  return (
    <>
      <Head>
        <title>Ventas Reales</title>
      </Head>
      <Box
        component="main"
        sx={{ flexGrow: 1, py: 8 }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Ventas Reales</Typography>

            <Card sx={{ p: 3 }}>
              <Stack spacing={2.5}>
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
                  <FormControl fullWidth>
                    <InputLabel id="platform-select-label">Plataforma</InputLabel>
                    <Select
                      labelId="platform-select-label"
                      value={platformId}
                      label="Plataforma"
                      onChange={(event) => {
                        setPlatformId(event.target.value);
                        setShopId('');
                      }}
                      disabled={loadingFilters}
                    >
                      {platforms.map((platform) => (
                        <MenuItem
                          key={platform._id}
                          value={platform._id}
                        >
                          {platform.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="city-select-label">Ciudad</InputLabel>
                    <Select
                      labelId="city-select-label"
                      value={cityId}
                      label="Ciudad"
                      onChange={(event) => {
                        setCityId(event.target.value);
                        setShopId('');
                      }}
                      disabled={loadingFilters}
                    >
                      {cities.map((city) => (
                        <MenuItem
                          key={city._id}
                          value={city._id}
                        >
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="shop-select-label">Local</InputLabel>
                    <Select
                      labelId="shop-select-label"
                      value={shopId}
                      label="Local"
                      onChange={(event) => setShopId(event.target.value)}
                      disabled={!platformId || !cityId}
                    >
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

                  <FormControl fullWidth>
                    <InputLabel id="period-select-label">Periodo</InputLabel>
                    <Select
                      labelId="period-select-label"
                      value={selectedPeriod}
                      label="Periodo"
                      onChange={(event) => setSelectedPeriod(Number(event.target.value))}
                    >
                      {PERIODS.map((period) => (
                        <MenuItem
                          key={period.id}
                          value={period.id}
                        >
                          {`${period.id}. ${period.name}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="year-select-label">Año</InputLabel>
                    <Select
                      labelId="year-select-label"
                      value={selectedYear}
                      label="Año"
                      onChange={(event) => setSelectedYear(Number(event.target.value))}
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

                  <TextField
                    fullWidth
                    label="Fecha inicio"
                    type="date"
                    value={startDate}
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    fullWidth
                    label="Fecha fin"
                    type="date"
                    value={endDate}
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />

                  <Button
                    variant="contained"
                    onClick={handleLoadRealSalesData}
                    disabled={loadingData}
                  >
                    {loadingData ? 'Consultando...' : 'Consultar'}
                  </Button>
                </Box>

                {error ? <Alert severity="error">{error}</Alert> : null}
              </Stack>
            </Card>

            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto / Categoría</TableCell>
                      <TableCell align="right">Venta real</TableCell>
                      <TableCell align="right">Venta calculada</TableCell>
                      <TableCell align="right">Dif. unidades</TableCell>
                      <TableCell align="right">Dif. %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.length ? categories.map((category) => (
                      <Fragment key={`category-block-${category._id}`}>
                        <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
                          <TableCell>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 700 }}
                            >
                              {category.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{formatNumber(category.realSale)}</TableCell>
                          <TableCell
                            align="right"
                            sx={{ width: 220 }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              value={toNumber(category.calculatedSale)}
                              onChange={(event) => {
                                handleCategoryCalculatedSaleChange(
                                  category._id,
                                  event.target.value,
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">{formatNumber(category.unitDifference)}</TableCell>
                          <TableCell align="right">{formatNumber(category.percentageDifference)}%</TableCell>
                        </TableRow>
                        {(category.products || []).map((product) => (
                          <TableRow
                            hover
                            key={`product-${product._id}`}
                          >
                            <TableCell sx={{ pl: 4 }}>{product.displayName || product.name}</TableCell>
                            <TableCell align="right">{formatNumber(product.realSale)}</TableCell>
                            <TableCell align="right">{formatNumber(product.calculatedSale)}</TableCell>
                            <TableCell align="right">{formatNumber(product.unitDifference)}</TableCell>
                            <TableCell align="right">{formatNumber(product.percentageDifference)}%</TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    )) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="center"
                        >
                          Consulta primero para listar categorías, productos y ventas reales.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowOrderedProducts((previous) => !previous)}
              sx={{ py: 1.25 }}
            >
              {showOrderedProducts ? 'Ocultar productos en orden' : 'Ver productos en orden'}
            </Button>

            <Collapse
              in={showOrderedProducts}
              timeout="auto"
              unmountOnExit
            >
              <Card sx={{ mt: 2 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ p: 2.5 }}
                >
                  <Box>
                    <Typography variant="h6">Productos en orden</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Se muestran ordenados por posición para validar el flujo real y calculado.
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleExportOrderedProducts}
                    disabled={!orderedProducts.length}
                    sx={{ minWidth: 0, px: 2 }}
                  >
                    Exportar Excel
                  </Button>
                </Stack>
                <Divider />
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Posición</TableCell>
                        <TableCell>Producto</TableCell>
                        <TableCell>Categoría</TableCell>
                        <TableCell align="right">Venta real</TableCell>
                        <TableCell align="right">Venta calculada</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderedProducts.length ? orderedProducts.map((product) => (
                        <TableRow
                          hover
                          key={`ordered-${product._id}`}
                        >
                          <TableCell>{formatNumber(product.position)}</TableCell>
                          <TableCell>{product.displayName || product.name}</TableCell>
                          <TableCell>{product.categoryName}</TableCell>
                          <TableCell align="right">{formatNumber(product.realSale)}</TableCell>
                          <TableCell align="right">{formatNumber(product.calculatedSale)}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="center"
                          >
                            No hay productos para mostrar.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Collapse>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving || !categories.length}
              >
                {saving ? 'Guardando...' : 'Guardar ventas reales'}
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
