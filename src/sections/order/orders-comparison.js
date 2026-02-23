import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
  Grid,
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
  Paper,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getOrders } from "src/services/orderService";
import { getShops } from "src/services/shopService";
import { getCities } from "src/services/cityService";

export const OrdersComparison = () => {
  const [shops, setShops] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [ordersFromAPI, setOrdersFromAPI] = useState([]);
  const [orderA, setOrderA] = useState(null);
  const [orderB, setOrderB] = useState(null);

  const fetchShops = async () => {
    try {
      const response = await getShops();
      setShops(response);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await getCities();
      setCities(response);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchCities();
  }, []);

  const fetchOrders = async () => {
    if (!selectedShop || !selectedCity) {
      alert("Por favor selecciona una tienda y una ciudad");
      return;
    }
    try {
      const response = await getOrders(1, 50, selectedShop, selectedCity, "");
      setOrdersFromAPI(response.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const getOrderDetails = (order) => {
    if (!order) return [];
    return order.orderDetails || [];
  };

  const calculateMetrics = (order) => {
    const details = getOrderDetails(order);
    if (details.length === 0) return { totalProducts: 0, totalInve: 0, totalAver: 0 };

    const totalProducts = details.length;
    const totalInve = details.reduce((sum, d) => sum + (Number(d.INVE) || 0), 0);
    const totalAver = details.reduce((sum, d) => sum + (Number(d.AVER) || 0), 0);

    return { totalProducts, totalInve, totalAver };
  };

  const metricsA = calculateMetrics(orderA);
  const metricsB = calculateMetrics(orderB);

  const options = {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Comparar Órdenes
      </Typography>

      {/* Filtros */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="shop-label">Tienda</InputLabel>
                <Select
                  labelId="shop-label"
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="city-label">Ciudad</InputLabel>
                <Select
                  labelId="city-label"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Seleccione una ciudad</em>
                  </MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city._id} value={city._id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchOrders}
            sx={{ alignSelf: "flex-start" }}
          >
            Cargar Órdenes
          </Button>
        </Stack>
      </Card>

      {/* Selector de órdenes */}
      {ordersFromAPI.length > 0 && (
        <Card sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Orden A
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="orderA-label">Selecciona Orden A</InputLabel>
                <Select
                  labelId="orderA-label"
                  value={orderA?._id || ""}
                  onChange={(e) => {
                    const selected = ordersFromAPI.find((o) => o._id === e.target.value);
                    setOrderA(selected || null);
                  }}
                >
                  <MenuItem value="">
                    <em>Selecciona una orden</em>
                  </MenuItem>
                  {ordersFromAPI.map((order) => (
                    <MenuItem key={order._id} value={order._id}>
                      {new Date(order.date).toLocaleDateString("es-CO", options)} - {order.user?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Orden B
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="orderB-label">Selecciona Orden B</InputLabel>
                <Select
                  labelId="orderB-label"
                  value={orderB?._id || ""}
                  onChange={(e) => {
                    const selected = ordersFromAPI.find((o) => o._id === e.target.value);
                    setOrderB(selected || null);
                  }}
                >
                  <MenuItem value="">
                    <em>Selecciona una orden</em>
                  </MenuItem>
                  {ordersFromAPI.map((order) => (
                    <MenuItem key={order._id} value={order._id}>
                      {new Date(order.date).toLocaleDateString("es-CO", options)} - {order.user?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Comparación */}
      {orderA && orderB && (
        <>
          {/* Métricas rápidas */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
                <Typography variant="caption" color="textSecondary">
                  Productos Orden A
                </Typography>
                <Typography variant="h5">{metricsA.totalProducts}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
                <Typography variant="caption" color="textSecondary">
                  Productos Orden B
                </Typography>
                <Typography variant="h5">{metricsB.totalProducts}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
                <Typography variant="caption" color="textSecondary">
                  Total INVE A
                </Typography>
                <Typography variant="h5">{metricsA.totalInve}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, textAlign: "center", bgcolor: "#f5f5f5" }}>
                <Typography variant="caption" color="textSecondary">
                  Total INVE B
                </Typography>
                <Typography variant="h5">{metricsB.totalInve}</Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Tabla de detalles lado a lado */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card>
                <Box sx={{ p: 2, bgcolor: "primary.light", color: "white" }}>
                  <Typography variant="h6">
                    Orden A - {new Date(orderA.date).toLocaleDateString("es-CO", options)}
                  </Typography>
                </Box>
                <TableContainer component={Paper} sx={{ overflowX: "auto", maxHeight: 600 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                        <TableCell sx={{ minWidth: 150, bgcolor: "#f5f5f5", position: "sticky", top: 0, left: 0, zIndex: 2 }}>Producto</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>INVE</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>AVER</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>LOTE</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>RECI</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>PEDI</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>VENT</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>PEDI_REAL</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>RENT</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>Cost</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>Sale Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getOrderDetails(orderA).map((detail, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell sx={{ minWidth: 150 }}>
                            <Box>
                              <Typography variant="body2">{detail.product?.name}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                {detail.product?.presentation}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">{detail.INVE || 0}</TableCell>
                          <TableCell align="right">
                            {detail.AVER > 0 ? (
                              <Chip
                                label={`${detail.AVER}`}
                                color="error"
                                size="small"
                              />
                            ) : (
                              <Typography variant="body2">0</Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">{detail.LOTE || "-"}</TableCell>
                          <TableCell align="right">{detail.RECI || 0}</TableCell>
                          <TableCell align="right">{detail.PEDI || 0}</TableCell>
                          <TableCell align="right">{detail.VENT || 0}</TableCell>
                          <TableCell align="right">{detail.PEDI_REAL || 0}</TableCell>
                          <TableCell align="right">{detail.RENT || 0}</TableCell>
                          <TableCell align="right">{detail.cost || 0}</TableCell>
                          <TableCell align="right">{detail.salePrice || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <Box sx={{ p: 2, bgcolor: "success.light", color: "white" }}>
                  <Typography variant="h6">
                    Orden B - {new Date(orderB.date).toLocaleDateString("es-CO", options)}
                  </Typography>
                </Box>
                <TableContainer component={Paper} sx={{ overflowX: "auto", maxHeight: 600 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                        <TableCell sx={{ minWidth: 150, bgcolor: "#f5f5f5", position: "sticky", top: 0, left: 0, zIndex: 2 }}>Producto</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>INVE</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>AVER</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>LOTE</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>RECI</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>PEDI</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>VENT</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>PEDI_REAL</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>RENT</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>Cost</TableCell>
                        <TableCell align="right" sx={{ bgcolor: "#f5f5f5", position: "sticky", top: 0, zIndex: 1 }}>Sale Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getOrderDetails(orderB).map((detail, idx) => (
                        <TableRow key={idx} hover>
                          <TableCell sx={{ minWidth: 150 }}>
                            <Box>
                              <Typography variant="body2">{detail.product?.name}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                {detail.product?.presentation}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">{detail.INVE || 0}</TableCell>
                          <TableCell align="right">
                            {detail.AVER > 0 ? (
                              <Chip
                                label={`${detail.AVER}`}
                                color="error"
                                size="small"
                              />
                            ) : (
                              <Typography variant="body2">0</Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">{detail.LOTE || "-"}</TableCell>
                          <TableCell align="right">{detail.RECI || 0}</TableCell>
                          <TableCell align="right">{detail.PEDI || 0}</TableCell>
                          <TableCell align="right">{detail.VENT || 0}</TableCell>
                          <TableCell align="right">{detail.PEDI_REAL || 0}</TableCell>
                          <TableCell align="right">{detail.RENT || 0}</TableCell>
                          <TableCell align="right">{detail.cost || 0}</TableCell>
                          <TableCell align="right">{detail.salePrice || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {!orderA && !orderB && ordersFromAPI.length === 0 && (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography color="textSecondary">
            Selecciona una tienda y ciudad, luego carga las órdenes para comenzar la comparación.
          </Typography>
        </Card>
      )}
    </Container>
  );
};
