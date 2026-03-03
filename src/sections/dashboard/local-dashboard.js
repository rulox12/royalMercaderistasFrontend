import { Box, Card, Container, Grid, Stack, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { getLocalDashboardData } from 'src/services/localDashboardService';
import { getPlatforms } from 'src/services/platformService';
import { getCities } from 'src/services/cityService';
import { getShops } from 'src/services/shopService';

export const LocalDashboard = () => {
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
  
  // Estados para filtros
  const [platform, setPlatform] = useState('');
  const [city, setCity] = useState('');
  const [local, setLocal] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [cities, setCities] = useState([]);
  const [locals, setLocals] = useState([]);
  const [startDateA, setStartDateA] = useState(prevMonthStart);
  const [endDateA, setEndDateA] = useState(prevMonthEnd);
  const [startDateB, setStartDateB] = useState(currentMonthStart);
  const [endDateB, setEndDateB] = useState(currentMonthEnd);

  useEffect(() => {
    getPlatforms().then(setPlatforms);
    getCities().then(setCities);
  }, []);

  useEffect(() => {
    if (city) {
      getShops({ cityId: city }).then(setLocals);
    } else {
      setLocals([]);
    }
  }, [city]);

  const [indicators, setIndicators] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const periodALabel = 'Periodo A';
  const periodBLabel = 'Periodo B';
  const periodATitle = `PERIODO A: ${getRangeLabel(startDateA, endDateA)}`;
  const periodBTitle = `PERIODO B: ${getRangeLabel(startDateB, endDateB)}`;

  const handleFilter = async () => {
    if (!local || !startDateA || !endDateA || !startDateB || !endDateB) return;

    if (startDateA > endDateA || startDateB > endDateB) {
      setError('Rango de fechas inválido: la fecha desde no puede ser mayor que la fecha hasta');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getLocalDashboardData({
        shopId: local,
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

  return (
    <Container maxWidth="xl">
      {/* Filtros */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
        >
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Plataforma</InputLabel>
            <Select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              label="Plataforma"
            >
              <MenuItem value=""><em>Selecciona</em></MenuItem>
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
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Ciudad</InputLabel>
            <Select
              value={city}
              onChange={e => setCity(e.target.value)}
              label="Ciudad"
            >
              <MenuItem value=""><em>Selecciona</em></MenuItem>
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
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Local</InputLabel>
            <Select
              value={local}
              onChange={e => setLocal(e.target.value)}
              label="Local"
            >
              <MenuItem value=""><em>Selecciona</em></MenuItem>
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
          <TextField
            sx={{ minWidth: 180 }}
            label="Desde A"
            type="date"
            value={startDateA}
            onChange={e => setStartDateA(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={{ minWidth: 180 }}
            label="Hasta A"
            type="date"
            value={endDateA}
            onChange={e => setEndDateA(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={{ minWidth: 180 }}
            label="Desde B"
            type="date"
            value={startDateB}
            onChange={e => setStartDateB(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            sx={{ minWidth: 180 }}
            label="Hasta B"
            type="date"
            value={endDateB}
            onChange={e => setEndDateB(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilter}
            disabled={loading}
          >
            Filtrar
          </Button>
        </Stack>
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
            Indicadores mostrados: Periodo A
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{ mb: 4 }}
          >
            {['pedidos','recibidos','averias','ventas','rentabilidad'].map((key, idx) => {
              const indA = indicators[key]?.monthA || { valor: 0, unidades: 0 };
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
                      {key.charAt(0).toUpperCase() + key.slice(1)}
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

      {/* Tabla de productos - Solo Periodo A */}
      {products.length > 0 && (
        <>
          <Card sx={{ p: 2, mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2 }}
            >
              Detalle de productos - Periodo A
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
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Pedidos</TableCell>
                    <TableCell align="right">Recibidos</TableCell>
                    <TableCell align="right">Averías</TableCell>
                    <TableCell align="right">Ventas</TableCell>
                    <TableCell align="right">Rentabilidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((prod, idx) => (
                    <TableRow
                      key={idx}
                      hover
                    >
                      <TableCell>{prod.name}</TableCell>
                      <TableCell align="right">{prod.pedidosA}</TableCell>
                      <TableCell align="right">{prod.recibidosA}</TableCell>
                      <TableCell align="right">{prod.averiasA}</TableCell>
                      <TableCell align="right">${prod.ventasA.toLocaleString()}</TableCell>
                      <TableCell align="right">${prod.rentabilidadA.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Tabla de comparación - Periodo A vs Periodo B */}
          <Card sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2 }}
            >
              Comparación Periodo A vs Periodo B
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
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Pedidos A</TableCell>
                    <TableCell align="right">Pedidos B</TableCell>
                    <TableCell align="right">Recibidos A</TableCell>
                    <TableCell align="right">Recibidos B</TableCell>
                    <TableCell align="right">Averías A</TableCell>
                    <TableCell align="right">Averías B</TableCell>
                    <TableCell align="right">Ventas A</TableCell>
                    <TableCell align="right">Ventas B</TableCell>
                    <TableCell align="right">Rentabilidad A</TableCell>
                    <TableCell align="right">Rentabilidad B</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((prod, idx) => (
                    <TableRow
                      key={idx}
                      hover
                    >
                      <TableCell>{prod.name}</TableCell>
                      <TableCell align="right">{prod.pedidosA}</TableCell>
                      <TableCell align="right">{prod.pedidosB}</TableCell>
                      <TableCell align="right">{prod.recibidosA}</TableCell>
                      <TableCell align="right">{prod.recibidosB}</TableCell>
                      <TableCell align="right">{prod.averiasA}</TableCell>
                      <TableCell align="right">{prod.averiasB}</TableCell>
                      <TableCell align="right">${prod.ventasA.toLocaleString()}</TableCell>
                      <TableCell align="right">${prod.ventasB.toLocaleString()}</TableCell>
                      <TableCell align="right">${prod.rentabilidadA.toLocaleString()}</TableCell>
                      <TableCell align="right">${prod.rentabilidadB.toLocaleString()}</TableCell>
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
