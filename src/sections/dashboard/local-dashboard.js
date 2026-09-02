import { Box, Card, Container, Grid, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import { getLocalDashboardData } from 'src/services/localDashboardService';
import { getPlatforms } from 'src/services/platformService';
import { getCities } from 'src/services/cityService';
import { getShops } from 'src/services/shopService';

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

  if (month === 0 && day <= 25) return 1;
  if (month === 11 && day >= 26) return 13;
  if (day >= 26) return month + 2;
  return month + 1;
};

const getPreviousPeriodSelection = (periodId, year) => {
  if (periodId === 1) {
    return { periodId: 13, year: year - 1 };
  }

  return { periodId: periodId - 1, year };
};

const buildPeriodRange = (periodId, year) => {
  const period = PERIODS.find((item) => item.id === periodId);

  if (!period) {
    return { startDate: '', endDate: '' };
  }

  return {
    startDate: toISODate(new Date(Date.UTC(year, period.startMonth, period.startDay))),
    endDate: toISODate(new Date(Date.UTC(year, period.endMonth, period.endDay))),
  };
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('es-CO').format(new Date(`${dateString}T00:00:00`));
};

const formatPeriodOptionLabel = (period, year) => {
  const { startDate, endDate } = buildPeriodRange(period.id, year);
  const rangeLabel = startDate && endDate ? ` ${formatDisplayDate(startDate)} a ${formatDisplayDate(endDate)}` : '';

  return `${period.id}. ${period.name}${rangeLabel}`;
};

export const LocalDashboard = () => {
  const referenceDate = new Date();
  referenceDate.setDate(referenceDate.getDate() - 2);
  referenceDate.setHours(0, 0, 0, 0);

  const currentYear = referenceDate.getFullYear();
  const defaultPeriodId = getCurrentPeriodId(referenceDate);
  const defaultComparison = getPreviousPeriodSelection(defaultPeriodId, currentYear);
  const defaultCurrentRange = buildPeriodRange(defaultPeriodId, currentYear);
  const defaultComparisonRange = buildPeriodRange(defaultComparison.periodId, defaultComparison.year);
  
  // Estados para filtros
  const [platform, setPlatform] = useState('');
  const [city, setCity] = useState('');
  const [local, setLocal] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [cities, setCities] = useState([]);
  const [locals, setLocals] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(defaultPeriodId);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [comparisonPeriod, setComparisonPeriod] = useState(defaultComparison.periodId);
  const [comparisonYear, setComparisonYear] = useState(defaultComparison.year);
  const [startDateA, setStartDateA] = useState(defaultComparisonRange.startDate);
  const [endDateA, setEndDateA] = useState(defaultComparisonRange.endDate);
  const [startDateB, setStartDateB] = useState(defaultCurrentRange.startDate);
  const [endDateB, setEndDateB] = useState(defaultCurrentRange.endDate);
  const [showDateFields, setShowDateFields] = useState(false);

  const yearOptions = useMemo(() => ([
    currentYear - 1,
    currentYear,
    currentYear + 1,
  ]), [currentYear]);

  useEffect(() => {
    getPlatforms().then(setPlatforms);
    getCities().then(setCities);
  }, []);

  useEffect(() => {
    getShops({
      ...(platform ? { platformId: platform } : {}),
      ...(city ? { cityId: city } : {}),
    }).then(setLocals);
  }, [city, platform]);

  const [indicators, setIndicators] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productSortDirection, setProductSortDirection] = useState('asc');

  const formatLabelDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-CO', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: 'long',
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

  const handleProductSort = () => {
    setProductSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  const selectedPeriodLabel = useMemo(() => {
    const period = PERIODS.find((item) => item.id === selectedPeriod);

    return period ? formatPeriodOptionLabel(period, selectedYear) : 'Periodo actual';
  }, [selectedPeriod, selectedYear]);

  const comparisonPeriodLabel = useMemo(() => {
    const period = PERIODS.find((item) => item.id === comparisonPeriod);

    return period ? formatPeriodOptionLabel(period, comparisonYear) : 'Periodo comparativo';
  }, [comparisonPeriod, comparisonYear]);

  const handlePeriodChange = (periodId, year) => {
    const range = buildPeriodRange(periodId, year);
    setSelectedPeriod(periodId);
    setStartDateB(range.startDate);
    setEndDateB(range.endDate);
  };

  const handleYearChange = (year) => {
    const range = buildPeriodRange(selectedPeriod, year);
    setSelectedYear(year);
    setStartDateB(range.startDate);
    setEndDateB(range.endDate);
  };

  const handleComparisonPeriodChange = (periodId, year) => {
    const range = buildPeriodRange(periodId, year);
    setComparisonPeriod(periodId);
    setStartDateA(range.startDate);
    setEndDateA(range.endDate);
  };

  const handleComparisonYearChange = (year) => {
    const range = buildPeriodRange(comparisonPeriod, year);
    setComparisonYear(year);
    setStartDateA(range.startDate);
    setEndDateA(range.endDate);
  };

  const sortedProducts = [...products].sort((productA, productB) => {
    const positionA = Number(productA.position);
    const positionB = Number(productB.position);

    const hasNumericPositionA = Number.isFinite(positionA) && productA.position !== '';
    const hasNumericPositionB = Number.isFinite(positionB) && productB.position !== '';

    let comparison = 0;

    if (hasNumericPositionA && hasNumericPositionB) {
      comparison = positionA - positionB;
    } else if (hasNumericPositionA) {
      comparison = -1;
    } else if (hasNumericPositionB) {
      comparison = 1;
    } else {
      const nameA = productA.name || '';
      const nameB = productB.name || '';
      comparison = nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
    }

    return productSortDirection === 'asc' ? comparison : -comparison;
  });

  const handleFilter = async () => {
    if (!startDateA || !endDateA || !startDateB || !endDateB) return;

    if (startDateA > endDateA || startDateB > endDateB) {
      setError('Rango de fechas inválido: la fecha desde no puede ser mayor que la fecha hasta');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getLocalDashboardData({
        shopId: local,
        platformId: platform,
        cityId: city,
        startDateA,
        endDateA,
        startDateB,
        endDateB
      });
      setIndicators(data.indicators);
      setProducts(data.products);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const actualColumnSx = { bgcolor: '#e3f2fd' };
  const comparativoColumnSx = { bgcolor: '#f3e5f5' };
  const indicatorLabels = {
    pedidos: 'Pedidos',
    recibidos: 'Recibidos',
    averias: 'Averías',
    ventas: 'Ventas',
    rentabilidad: 'Rentabilidad Neta'
  };

  return (
    <Container maxWidth="xl">
      {/* Filtros */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="current-period-label">Periodo actual</InputLabel>
            <Select
              labelId="current-period-label"
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
            <InputLabel id="current-year-label">Año actual</InputLabel>
            <Select
              labelId="current-year-label"
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
            <InputLabel id="comparison-period-label">Periodo comparativo</InputLabel>
            <Select
              labelId="comparison-period-label"
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
            <InputLabel id="comparison-year-label">Año comparativo</InputLabel>
            <Select
              labelId="comparison-year-label"
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
                fullWidth
                label="Desde Actual"
                type="date"
                value={startDateB}
                onChange={e => setStartDateB(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Hasta Actual"
                type="date"
                value={endDateB}
                onChange={e => setEndDateB(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Desde Comparativo"
                type="date"
                value={startDateA}
                onChange={e => setStartDateA(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Hasta Comparativo"
                type="date"
                value={endDateA}
                onChange={e => setEndDateA(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </>
          ) : null}
          <FormControl fullWidth>
            <InputLabel
              id="platform-label"
              shrink
            >
              Plataforma
            </InputLabel>
            <Select
              displayEmpty
              labelId="platform-label"
              value={platform}
              label="Plataforma"
              renderValue={(value) => {
                if (!value) return 'Todas';
                return platforms.find((item) => item._id === value)?.name || 'Todas';
              }}
              onChange={(event) => {
                setPlatform(event.target.value);
                setLocal('');
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              {platforms.map((p) => (
                <MenuItem
                  key={p._id}
                  value={p._id}
                >
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel
              id="city-label"
              shrink
            >
              Ciudad
            </InputLabel>
            <Select
              displayEmpty
              labelId="city-label"
              value={city}
              label="Ciudad"
              renderValue={(value) => {
                if (!value) return 'Todas';
                return cities.find((item) => item._id === value)?.name || 'Todas';
              }}
              onChange={(event) => {
                setCity(event.target.value);
                setLocal('');
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              {cities.map((c) => (
                <MenuItem
                  key={c._id}
                  value={c._id}
                >
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel
              id="local-label"
              shrink
            >
              Local
            </InputLabel>
            <Select
              displayEmpty
              labelId="local-label"
              value={local}
              onChange={e => setLocal(e.target.value)}
              label="Local"
              renderValue={(value) => {
                if (!value) return 'Todos los locales';
                return locals.find((item) => item._id === value)?.name || 'Todos los locales';
              }}
            >
              <MenuItem value="">Todos los locales</MenuItem>
              {locals.map((l) => (
                <MenuItem
                  key={l._id}
                  value={l._id}
                >
                  {l.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              gridColumn: { xs: '1 / -1', md: '4 / 5' },
              display: 'flex',
              justifyContent: { xs: 'stretch', sm: 'flex-end' },
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleFilter}
              disabled={loading}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Filtrar
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Títulos de períodos */}
      {indicators && (
        <Box sx={{
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
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#424242',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <Box
                component="span"
                sx={{
                  color: '#1976d2',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  flexShrink: 0
                }}
              >
                Actual (A)
              </Box>
              <Box
                component="span"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {getRangeLabel(startDateB, endDateB)}
              </Box>
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
              variant="body2"
              sx={{
                fontWeight: 600,
                color: '#424242',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <Box
                component="span"
                sx={{
                  color: '#7b1fa2',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  flexShrink: 0
                }}
              >
                Comparativo (C)
              </Box>
              <Box
                component="span"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {getRangeLabel(startDateA, endDateA)}
              </Box>
            </Typography>
          </Box>
        </Box>
      )}

      {/* Indicadores tipo doughnut */}
      {loading && <Typography sx={{ mb: 2 }}>Cargando...</Typography>}
      {error && (
        <Typography
          color="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Typography>
      )}
      {indicators && (
        <>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Indicadores mostrados: Actual (A)
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{ mb: 4 }}
          >
            {['ventas', 'averias', 'pedidos', 'recibidos', 'rentabilidad'].map((key, idx) => {
              const indA = indicators[key]?.monthB || { valor: 0, unidades: 0 };
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={2.4}
                  key={key}
                >
                  <Card sx={{ p: 2, textAlign: 'center', minWidth: 180, bgcolor: '#f9f9f9' }}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      {indicatorLabels[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ color: '#000', fontWeight: 700, mb: 0.5 }}
                    >
                      ${Math.round(indA.valor).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'success.main', fontWeight: 600 }}
                    >
                      {indA.unidades.toLocaleString()} unidades
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {/* Tabla de productos - Solo Actual (A) */}
      {products.length > 0 && (
        <>
          <Card sx={{ p: 2, mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2 }}
            >
              Detalle de productos - Actual (A)
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 350, overflowY: 'auto' }}
            >
              <Table
                stickyHeader
                size="small"
              >
                <TableHead>
                  <TableRow
                    sx={{
                      '& .MuiTableCell-root': { fontSize: '0.72rem', py: 1 },
                      '& .MuiTableSortLabel-root': { fontSize: '0.72rem' }
                    }}
                  >
                    <TableCell sortDirection={productSortDirection}>
                      <TableSortLabel
                        active
                        direction={productSortDirection}
                        onClick={handleProductSort}
                      >
                        Producto
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right">Pedidos</TableCell>
                    <TableCell align="right">Recibidos</TableCell>
                    <TableCell align="right">Averías</TableCell>
                    <TableCell align="right">Ventas</TableCell>
                    <TableCell align="right">Ventas $</TableCell>
                    <TableCell align="right">Rentabilidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedProducts.map((prod, idx) => (
                    <TableRow
                      key={idx}
                      hover
                    >
                      <TableCell>{prod.name}</TableCell>
                      <TableCell align="right">{prod.pedidosB}</TableCell>
                      <TableCell align="right">{prod.recibidosB}</TableCell>
                      <TableCell align="right">{prod.averiasB}</TableCell>
                      <TableCell align="right">{(prod.ventasBUnidades || 0).toLocaleString()}</TableCell>
                      <TableCell align="right">${prod.ventasB.toLocaleString()}</TableCell>
                      <TableCell align="right">${prod.rentabilidadB.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Tabla de comparación - Comparativo (C) vs Actual (A) */}
          <Card sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2 }}
            >
              Comparación Actual (A) vs Comparativo (C)
            </Typography>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 350, overflowY: 'auto' }}
            >
              <Table
                stickyHeader
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell sortDirection={productSortDirection}>
                      <TableSortLabel
                        active
                        direction={productSortDirection}
                        onClick={handleProductSort}
                      >
                        Producto
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>Pedidos (A)</TableCell>
                    <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>Pedidos (C)</TableCell>
                    <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>Recibidos (A)</TableCell>
                    <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>Recibidos (C)</TableCell>
                    <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>Averías (A)</TableCell>
                    <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>Averías (C)</TableCell>
                    <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>Ventas (A)</TableCell>
                    <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>Ventas $ (A)</TableCell>
                    <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>Ventas (C)</TableCell>
                    <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>Ventas $ (C)</TableCell>
                    <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>Rentabilidad (A)</TableCell>
                    <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>Rentabilidad (C)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedProducts.map((prod, idx) => (
                    <TableRow
                      key={idx}
                      hover
                    >
                      <TableCell>{prod.name}</TableCell>
                      <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>{prod.pedidosB}</TableCell>
                      <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>{prod.pedidosA}</TableCell>
                      <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>{prod.recibidosB}</TableCell>
                      <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>{prod.recibidosA}</TableCell>
                      <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>{prod.averiasB}</TableCell>
                      <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>{prod.averiasA}</TableCell>
                      <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>{(prod.ventasBUnidades || 0).toLocaleString()}</TableCell>
                      <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>${prod.ventasB.toLocaleString()}</TableCell>
                      <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>{(prod.ventasAUnidades || 0).toLocaleString()}</TableCell>
                      <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>${prod.ventasA.toLocaleString()}</TableCell>
                      <TableCell sx={{ ...actualColumnSx, textAlign: 'right' }}>${prod.rentabilidadB.toLocaleString()}</TableCell>
                      <TableCell sx={{ ...comparativoColumnSx, textAlign: 'right' }}>${prod.rentabilidadA.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}
    </Container>
  );
};
