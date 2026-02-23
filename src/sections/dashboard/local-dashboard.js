import { Box, Card, Container, Grid, Stack, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { getLocalDashboardData } from 'src/services/localDashboardService';
import { getPlatforms } from 'src/services/platformService';
import { getCities } from 'src/services/cityService';
import { getShops } from 'src/services/shopService';

export const LocalDashboard = () => {
  // Estados para filtros
  const [platform, setPlatform] = useState('');
  const [city, setCity] = useState('');
  const [local, setLocal] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [cities, setCities] = useState([]);
  const [locals, setLocals] = useState([]);
  const [monthA, setMonthA] = useState(new Date().getMonth() + 1);
  const [yearA, setYearA] = useState(new Date().getFullYear());
  const [monthB, setMonthB] = useState(new Date().getMonth() + 1);
  const [yearB, setYearB] = useState(new Date().getFullYear());

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

  const handleFilter = async () => {
    if (!local) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getLocalDashboardData({
        shopId: local,
        monthA,
        yearA,
        monthB,
        yearB
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
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Plataforma</InputLabel>
            <Select value={platform} onChange={e => setPlatform(e.target.value)} label="Plataforma">
              <MenuItem value=""><em>Selecciona</em></MenuItem>
              {platforms.map((p) => (
                <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Ciudad</InputLabel>
            <Select value={city} onChange={e => setCity(e.target.value)} label="Ciudad">
              <MenuItem value=""><em>Selecciona</em></MenuItem>
              {cities.map((c) => (
                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Local</InputLabel>
            <Select value={local} onChange={e => setLocal(e.target.value)} label="Local">
              <MenuItem value=""><em>Selecciona</em></MenuItem>
              {locals.map((l) => (
                <MenuItem key={l._id} value={l._id}>{l.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Fechas: mes y año para comparar */}
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Mes A</InputLabel>
            <Select value={monthA} onChange={e => setMonthA(Number(e.target.value))} label="Mes A">
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es-CO', { month: 'long' })}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Año A</InputLabel>
            <Select value={yearA} onChange={e => setYearA(Number(e.target.value))} label="Año A">
              {[2024, 2025, 2026].map(y => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Mes B</InputLabel>
            <Select value={monthB} onChange={e => setMonthB(Number(e.target.value))} label="Mes B">
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es-CO', { month: 'long' })}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Año B</InputLabel>
            <Select value={yearB} onChange={e => setYearB(Number(e.target.value))} label="Año B">
              {[2024, 2025, 2026].map(y => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleFilter} disabled={loading}>Filtrar</Button>
        </Stack>
      </Card>

      {/* Indicadores tipo doughnut */}
      {loading && <Typography sx={{ mb: 2 }}>Cargando...</Typography>}
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {indicators && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {['pedidos','recibidos','averias','ventas','rentabilidad'].map((key, idx) => {
            const indA = indicators[key]?.monthA || { valor: 0, unidades: 0 };
            return (
              <Grid item xs={12} sm={6} md={2.4} key={key}>
                <Card sx={{ p: 2, textAlign: 'center', minWidth: 180, bgcolor: '#f9f9f9' }}>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#000', fontWeight: 700, mb: 0.5 }}>
                    ${Math.round(indA.valor).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                    {indA.unidades.toLocaleString()} unidades
                  </Typography>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Tabla de productos - Solo Mes B */}
      {products.length > 0 && (
        <>
          <Card sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Detalle de productos - Mes B</Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 350, overflowY: 'auto' }}>
              <Table stickyHeader size="small">
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
                    <TableRow key={idx} hover>
                      <TableCell>{prod.name}</TableCell>
                      <TableCell align="right">{prod.pedidosB}</TableCell>
                      <TableCell align="right">{prod.recibidosB}</TableCell>
                      <TableCell align="right">{prod.averiasB}</TableCell>
                      <TableCell align="right">${prod.ventasB.toLocaleString()}</TableCell>
                      <TableCell align="right">${prod.rentabilidadB.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Tabla de comparación - Mes A vs Mes B */}
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Comparación Mes A vs Mes B</Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 350, overflowY: 'auto' }}>
              <Table stickyHeader size="small">
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
                    <TableRow key={idx} hover>
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
