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
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { getPlatforms } from 'src/services/platformService';
import { getCities } from 'src/services/cityService';
import { getShops } from 'src/services/shopService';
import { getRealSaleFormData } from 'src/services/realSaleService';

const ALL_VALUE = 'ALL';

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

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatNumber = (value) => new Intl.NumberFormat('es-CO').format(toNumber(value));

const calculatePercent = (realSale, calculatedSale) => {
  if (!calculatedSale) {
    return 0;
  }

  return Number((((realSale - calculatedSale) / calculatedSale) * 100).toFixed(2));
};

const toISODate = (date) => date.toISOString().split('T')[0];

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

const sanitizeFileNamePart = (value) => {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\-_]/g, '')
    .toLowerCase();
};

const formatDisplayDate = (dateString) => {
  if (!dateString) {
    return '';
  }

  const parsedDate = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('es-CO').format(parsedDate);
};

const formatPeriodOptionLabel = (period, year) => {
  const { startDate, endDate } = buildPeriodRange(period.id, year);
  const rangeLabel = startDate && endDate ? ` ${formatDisplayDate(startDate)} a ${formatDisplayDate(endDate)}` : '';
  return `${period.id}. ${period.name}${rangeLabel}`;
};

const getEntityId = (value) => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value._id || '';
};

const aggregateProducts = (categories) => {
  const map = new Map();

  (categories || []).forEach((category) => {
    (category.products || []).forEach((product) => {
      const productId = product._id;
      const current = map.get(productId) || {
        productId,
        position: toNumber(product.position),
        productName: product.displayName || product.name || '',
        categoryName: category.name || '',
        realSale: 0,
        calculatedSale: 0,
      };

      current.realSale += toNumber(product.realSale);
      current.calculatedSale += toNumber(product.calculatedSale);
      map.set(productId, current);
    });
  });

  return Array.from(map.values())
    .map((row) => {
      const unitDifference = row.realSale - row.calculatedSale;
      return {
        ...row,
        unitDifference,
        percentageDifference: calculatePercent(row.realSale, row.calculatedSale),
      };
    })
    .sort((a, b) => {
      if (a.position !== b.position) {
        return a.position - b.position;
      }

      return String(a.productName).localeCompare(String(b.productName));
    });
};

const mergeRows = (rowsByShop) => {
  const map = new Map();

  rowsByShop.forEach((rows) => {
    rows.forEach((row) => {
      const current = map.get(row.productId) || {
        productId: row.productId,
        position: row.position,
        productName: row.productName,
        categoryName: row.categoryName,
        realSale: 0,
        calculatedSale: 0,
      };

      current.realSale += toNumber(row.realSale);
      current.calculatedSale += toNumber(row.calculatedSale);
      map.set(row.productId, current);
    });
  });

  return Array.from(map.values())
    .map((row) => {
      const unitDifference = row.realSale - row.calculatedSale;
      return {
        ...row,
        unitDifference,
        percentageDifference: calculatePercent(row.realSale, row.calculatedSale),
      };
    })
    .sort((a, b) => {
      if (a.position !== b.position) {
        return a.position - b.position;
      }

      return String(a.productName).localeCompare(String(b.productName));
    });
};

const buildTotals = (rows) => {
  const totals = rows.reduce((acc, row) => ({
    realSale: acc.realSale + toNumber(row.realSale),
    calculatedSale: acc.calculatedSale + toNumber(row.calculatedSale),
  }), {
    realSale: 0,
    calculatedSale: 0,
  });

  return {
    ...totals,
    unitDifference: totals.realSale - totals.calculatedSale,
    percentageDifference: calculatePercent(totals.realSale, totals.calculatedSale),
  };
};

const buildSheetRows = (rows) => rows.map((row) => ({
  Posicion: toNumber(row.position),
  Producto: row.productName || '',
  Categoria: row.categoryName || '',
  VentaReal: toNumber(row.realSale),
  VentaCalculada: toNumber(row.calculatedSale),
  DiferenciaUnidades: toNumber(row.unitDifference),
  DiferenciaPorcentaje: toNumber(row.percentageDifference),
}));

const ReportTable = ({ rows }) => {
  const totals = useMemo(() => buildTotals(rows), [rows]);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ py: 1, px: 1.5 }}>Producto</TableCell>
            <TableCell sx={{ py: 1, px: 1.5 }}>Categoria</TableCell>
            <TableCell sx={{ py: 1, px: 1.5 }} align="left">Venta real</TableCell>
            <TableCell sx={{ py: 1, px: 1.5 }} align="left">Venta calculada</TableCell>
            <TableCell sx={{ py: 1, px: 1.5 }} align="left">Dif. unidades</TableCell>
            <TableCell sx={{ py: 1, px: 1.5 }} align="left">Dif. %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length ? rows.map((row) => (
            <TableRow key={row.productId}>
              <TableCell sx={{ py: 0.5, px: 1.5 }}>{row.productName}</TableCell>
              <TableCell sx={{ py: 0.5, px: 1.5 }}>{row.categoryName}</TableCell>
              <TableCell sx={{ py: 0.5, px: 1.5 }} align="left">{formatNumber(row.realSale)}</TableCell>
              <TableCell sx={{ py: 0.5, px: 1.5 }} align="left">{formatNumber(row.calculatedSale)}</TableCell>
              <TableCell sx={{ py: 0.5, px: 1.5 }} align="left">{formatNumber(row.unitDifference)}</TableCell>
              <TableCell sx={{ py: 0.5, px: 1.5 }} align="left">{formatNumber(row.percentageDifference)}%</TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={6} align="left">No hay datos para mostrar.</TableCell>
            </TableRow>
          )}

          {rows.length ? (
            <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.06)' }}>
              <TableCell sx={{ py: 0.75, px: 1.5 }} colSpan={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Totales</Typography>
              </TableCell>
              <TableCell sx={{ py: 0.75, px: 1.5 }} align="left">
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{formatNumber(totals.realSale)}</Typography>
              </TableCell>
              <TableCell sx={{ py: 0.75, px: 1.5 }} align="left">
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{formatNumber(totals.calculatedSale)}</Typography>
              </TableCell>
              <TableCell sx={{ py: 0.75, px: 1.5 }} align="left">
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{formatNumber(totals.unitDifference)}</Typography>
              </TableCell>
              <TableCell sx={{ py: 0.75, px: 1.5 }} align="left">
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{formatNumber(totals.percentageDifference)}%</Typography>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Page = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const currentPeriodId = useMemo(() => getCurrentPeriodId(), []);
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriodId);
  const selectedPeriodData = useMemo(
    () => PERIODS.find((period) => period.id === selectedPeriod),
    [selectedPeriod]
  );

  const periodRange = useMemo(
    () => buildPeriodRange(selectedPeriod, currentYear),
    [selectedPeriod, currentYear]
  );

  const [platforms, setPlatforms] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(ALL_VALUE);
  const [selectedCity, setSelectedCity] = useState(ALL_VALUE);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [accumulatedRows, setAccumulatedRows] = useState([]);
  const [shopReports, setShopReports] = useState([]);

  const loadFilters = useCallback(async () => {
    try {
      const [platformsResponse, citiesResponse] = await Promise.all([
        getPlatforms(),
        getCities(),
      ]);

      setPlatforms([
        { _id: ALL_VALUE, name: 'Todas' },
        ...(platformsResponse || []),
      ]);

      setCities([
        { _id: ALL_VALUE, name: 'Todas' },
        ...(citiesResponse || []),
      ]);
    } catch (loadError) {
      setError('No fue posible cargar plataforma y ciudad.');
    }
  }, []);

  const handleConsult = useCallback(async () => {
    setLoading(true);
    setError('');
    setAccumulatedRows([]);
    setShopReports([]);

    try {
      const shopFilters = {};

      if (selectedPlatform !== ALL_VALUE) {
        shopFilters.platformId = selectedPlatform;
      }

      if (selectedCity !== ALL_VALUE) {
        shopFilters.cityId = selectedCity;
      }

      const shopsResponse = await getShops(shopFilters);
      const availableShops = shopsResponse || [];

      if (!availableShops.length) {
        setError('No se encontraron tiendas para el filtro seleccionado.');
        return;
      }

      const reports = await Promise.all(availableShops.map(async (shop) => {
        try {
          const platformIdForRequest = selectedPlatform !== ALL_VALUE
            ? selectedPlatform
            : getEntityId(shop.platformId);
          const cityIdForRequest = selectedCity !== ALL_VALUE
            ? selectedCity
            : getEntityId(shop.cityId);

          if (!platformIdForRequest || !cityIdForRequest) {
            return null;
          }

          const response = await getRealSaleFormData({
            platformId: platformIdForRequest,
            cityId: cityIdForRequest,
            shopId: shop._id,
            startDate: periodRange.startDate,
            endDate: periodRange.endDate,
          });

          const rows = aggregateProducts(response.categories || []);

          return {
            shopId: shop._id,
            shopName: shop.name || 'Sin nombre',
            rows,
          };
        } catch (shopError) {
          return null;
        }
      }));

      const validReports = reports.filter((item) => item && item.rows.length > 0);

      if (!validReports.length) {
        setError('No se encontraron datos de ventas reales para las tiendas del filtro.');
        return;
      }

      setShopReports(validReports);
      setAccumulatedRows(mergeRows(validReports.map((item) => item.rows)));
    } catch (consultError) {
      setError('No fue posible consultar las ventas reales masivas.');
    } finally {
      setLoading(false);
    }
  }, [periodRange.endDate, periodRange.startDate, selectedCity, selectedPlatform]);

  const handleExport = useCallback(() => {
    if (!accumulatedRows.length) {
      return;
    }

    const workbook = XLSX.utils.book_new();

    const accumulatedSheet = XLSX.utils.json_to_sheet(buildSheetRows(accumulatedRows));
    XLSX.utils.book_append_sheet(workbook, accumulatedSheet, 'Acumulado');

    shopReports.forEach((report) => {
      const shopSheet = XLSX.utils.json_to_sheet(buildSheetRows(report.rows));
      const safeSheetName = String(report.shopName || 'Tienda').slice(0, 31);
      XLSX.utils.book_append_sheet(workbook, shopSheet, safeSheetName);
    });

    const selectedPlatformName = selectedPlatform === ALL_VALUE
      ? 'todas-plataformas'
      : (platforms.find((platform) => platform._id === selectedPlatform)?.name || 'plataforma');

    const selectedCityName = selectedCity === ALL_VALUE
      ? 'todas-ciudades'
      : (cities.find((city) => city._id === selectedCity)?.name || 'ciudad');

    const periodPart = sanitizeFileNamePart(selectedPeriodData?.name || 'periodo');
    const yearPart = sanitizeFileNamePart(String(currentYear));
    const platformPart = sanitizeFileNamePart(selectedPlatformName);
    const cityPart = sanitizeFileNamePart(selectedCityName);

    const fileName = `ventas-reales-masivo_${platformPart}_${cityPart}_${periodPart}_${yearPart}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }, [
    accumulatedRows,
    cities,
    currentYear,
    platforms,
    selectedCity,
    selectedPeriodData,
    selectedPlatform,
    shopReports,
  ]);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  return (
    <>
      <Head>
        <title>Ventas Reales Masivo</title>
      </Head>

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, md: 3 } }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Typography variant="h4">Ventas Reales Masivo</Typography>

            <Card sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Typography variant="body2" color="text.secondary">
                  Periodo aplicado: {selectedPeriodData?.name || 'N/A'} ({periodRange.startDate} a {periodRange.endDate})
                </Typography>

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
                    <InputLabel id="massive-platform-select-label">Plataforma</InputLabel>
                    <Select
                      labelId="massive-platform-select-label"
                      value={selectedPlatform}
                      label="Plataforma"
                      onChange={(event) => setSelectedPlatform(event.target.value)}
                    >
                      {platforms.map((platform) => (
                        <MenuItem key={platform._id} value={platform._id}>
                          {platform.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="massive-city-select-label">Ciudad</InputLabel>
                    <Select
                      labelId="massive-city-select-label"
                      value={selectedCity}
                      label="Ciudad"
                      onChange={(event) => setSelectedCity(event.target.value)}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city._id} value={city._id}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="massive-period-select-label">Periodo</InputLabel>
                    <Select
                      labelId="massive-period-select-label"
                      value={selectedPeriod}
                      label="Periodo"
                      onChange={(event) => setSelectedPeriod(Number(event.target.value))}
                    >
                      {PERIODS.map((period) => (
                        <MenuItem key={period.id} value={period.id}>
                          {formatPeriodOptionLabel(period, currentYear)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Button variant="contained" onClick={handleConsult} disabled={loading}>
                      {loading ? 'Consultando...' : 'Consultar'}
                    </Button>
                    <Button variant="outlined" onClick={handleExport} disabled={!accumulatedRows.length}>
                      Exportar Excel
                    </Button>
                  </Stack>
                </Box>

                {error ? <Alert severity="error">{error}</Alert> : null}
              </Stack>
            </Card>

            <Card>
              <Box sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ mb: 1.5 }}>Acumulado general</Typography>
                <ReportTable rows={accumulatedRows} />
              </Box>
            </Card>

            {shopReports.map((report) => (
              <Card key={report.shopId}>
                <Box sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ mb: 1.5 }}>
                    {report.shopName}
                  </Typography>
                  <ReportTable rows={report.rows} />
                </Box>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
