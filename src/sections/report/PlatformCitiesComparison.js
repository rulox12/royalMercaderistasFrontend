// src/sections/report/PlatformCitiesComparison.js
import {
  Box,
  Container,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Modal,
  Fab,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getPlatformCitiesComparison } from "src/services/reportService";
import { getPlatforms } from "src/services/platformService";
import { ComparisonPieAlt, ComparisonBarAlt, ComparisonProgressAlt } from "src/sections/report/ComparisonPie";
import AddIcon from "@mui/icons-material/Add";

export const PlatformCitiesComparison = () => {
  const toISODate = (date) => date.toISOString().split("T")[0];

  // Calcular fechas por defecto con corte 26-25
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let actualStartDate;
  let actualEndDate;
  let comparativeStartDate;
  let comparativeEndDate;

  if (currentDay <= 25) {
    // Actual: 26 del mes pasado al 25 del mes actual
    // Comparativo: 26 de hace dos meses al 25 del mes pasado
    actualStartDate = new Date(currentYear, currentMonth - 1, 26);
    actualEndDate = new Date(currentYear, currentMonth, 25);
    comparativeStartDate = new Date(currentYear, currentMonth - 2, 26);
    comparativeEndDate = new Date(currentYear, currentMonth - 1, 25);
  } else {
    // Actual: 26 del mes actual al 25 del siguiente o día actual
    // Comparativo: 26 del mes pasado al 25 del mes actual
    actualStartDate = new Date(currentYear, currentMonth, 26);
    const nextCutoffDate = new Date(currentYear, currentMonth + 1, 25);
    actualEndDate = now < nextCutoffDate ? now : nextCutoffDate;
    comparativeStartDate = new Date(currentYear, currentMonth - 1, 26);
    comparativeEndDate = new Date(currentYear, currentMonth, 25);
  }

  const currentMonthStart = toISODate(actualStartDate);
  const currentMonthEnd = toISODate(actualEndDate);
  const prevMonthStart = toISODate(comparativeStartDate);
  const prevMonthEnd = toISODate(comparativeEndDate);
  
  const [platformId, setPlatformId] = useState("");
  const [startDateA, setStartDateA] = useState(currentMonthStart);
  const [endDateA, setEndDateA] = useState(currentMonthEnd);
  const [startDateB, setStartDateB] = useState(prevMonthStart);
  const [endDateB, setEndDateB] = useState(prevMonthEnd);
  const [reportData, setReportData] = useState(null);
  const [platforms, setPlatforms] = useState([]);

  // Estado para modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchPlatforms = async () => {
    try {
      const response = await getPlatforms();
      setPlatforms(response);
    } catch (error) {
      console.error("Error fetching platforms:", error);
    }
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  useEffect(() => {
    if (platforms.length > 0) {
      setPlatformId(platforms[0]._id);
    }
  }, [platforms]);

  useEffect(() => {
    if (!platformId || !startDateA || !endDateA || !startDateB || !endDateB) return;
    if (startDateA > endDateA || startDateB > endDateB) return;

    const fetchReport = async () => {
      try {
        const response = await getPlatformCitiesComparison(
          platformId,
          startDateA,
          endDateA,
          startDateB,
          endDateB
        );
        setReportData(response);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    if (platformId) {
      fetchReport();
    }
  }, [platformId, startDateA, endDateA, startDateB, endDateB]);

  const buildComparisonData = (monthAData = {}, monthBData = {}) => [
    {
      _id: { startDate: startDateA, endDate: endDateA },
      ventas: Number(monthAData.ventasValor) || 0,
      ventasCantidad: Number(monthAData.ventasCantidad) || 0,
      averias: Number(monthAData.averias) || 0,
      averiasCantidad: Number(monthAData.averias) || 0,
      averiasValor: Number(monthAData.averiasValor) || 0,
      rentabilidad: Number(monthAData.rentabilidad) || 0,
    },
    {
      _id: { startDate: startDateB, endDate: endDateB },
      ventas: Number(monthBData.ventasValor) || 0,
      ventasCantidad: Number(monthBData.ventasCantidad) || 0,
      averias: Number(monthBData.averias) || 0,
      averiasCantidad: Number(monthBData.averias) || 0,
      averiasValor: Number(monthBData.averiasValor) || 0,
      rentabilidad: Number(monthBData.rentabilidad) || 0,
    },
  ];

  const formatLabelDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("es-CO", {
      timeZone: "America/Bogota",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };

  const getRangeLabel = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return "Periodo";
    }
    if (startDate === endDate) {
      return formatLabelDate(startDate);
    }
    return `${formatLabelDate(startDate)} - ${formatLabelDate(endDate)}`;
  };

  const periodALabel = "Comparativo";
  const periodBLabel = "Actual";

  const formatCurrency = (value) => {
    const roundedValue = Math.round(Number(value) || 0);
    return `$${roundedValue.toLocaleString("es-CO")}`;
  };

  const orderedCities = [
    "Bogotá",
    "Cartagena",
    "Barranquilla",
    "Santa Marta",
    "Bucaramanga",
  ];

  const sortedReportData = [...(reportData || [])].sort((leftCity, rightCity) => {
    const leftIndex = orderedCities.indexOf(leftCity.city);
    const rightIndex = orderedCities.indexOf(rightCity.city);

    if (leftIndex !== -1 && rightIndex !== -1) {
      return leftIndex - rightIndex;
    }

    if (leftIndex !== -1) {
      return -1;
    }

    if (rightIndex !== -1) {
      return 1;
    }

    return leftCity.city.localeCompare(rightCity.city, "es");
  });

  const reportTotals = sortedReportData.reduce(
    (accumulator, cityReport) => {
      accumulator.ventasActual += Number(cityReport?.monthB?.ventasValor) || 0;
      accumulator.ventasComparativo += Number(cityReport?.monthA?.ventasValor) || 0;
      accumulator.averiasActual += Number(cityReport?.monthB?.averias) || 0;
      accumulator.averiasComparativo += Number(cityReport?.monthA?.averias) || 0;
      accumulator.averiasValorActual += Number(cityReport?.monthB?.averiasValor) || 0;
      accumulator.averiasValorComparativo += Number(cityReport?.monthA?.averiasValor) || 0;
      accumulator.rentabilidadActual += Number(cityReport?.monthB?.rentabilidad) || 0;
      accumulator.rentabilidadComparativo += Number(cityReport?.monthA?.rentabilidad) || 0;
      accumulator.ventasUnidadesActual += Number(cityReport?.monthB?.ventasCantidad) || 0;
      accumulator.ventasUnidadesComparativo += Number(cityReport?.monthA?.ventasCantidad) || 0;
      return accumulator;
    },
    {
      ventasActual: 0,
      ventasComparativo: 0,
      averiasActual: 0,
      averiasComparativo: 0,
      averiasValorActual: 0,
      averiasValorComparativo: 0,
      rentabilidadActual: 0,
      rentabilidadComparativo: 0,
      ventasUnidadesActual: 0,
      ventasUnidadesComparativo: 0,
    }
  );

  const totalPctAveriasVentasActual =
    reportTotals.ventasUnidadesActual > 0
      ? (reportTotals.averiasActual / reportTotals.ventasUnidadesActual) * 100
      : 0;
  const totalPctAveriasVentasComparativo =
    reportTotals.ventasUnidadesComparativo > 0
      ? (reportTotals.averiasComparativo / reportTotals.ventasUnidadesComparativo) * 100
      : 0;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      {/* Títulos de períodos */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minWidth: 250,
            p: 2,
            bgcolor: "#e3f2fd",
            borderLeft: "4px solid #1976d2",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#424242",
              display: "flex",
              alignItems: "center",
              gap: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Box
              component="span"
              sx={{
                color: "#1976d2",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                flexShrink: 0,
              }}
            >
              Actual
            </Box>
            <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {getRangeLabel(startDateA, endDateA)}
            </Box>
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 250,
            p: 2,
            bgcolor: "#f3e5f5",
            borderLeft: "4px solid #7b1fa2",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#424242",
              display: "flex",
              alignItems: "center",
              gap: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Box
              component="span"
              sx={{
                color: "#7b1fa2",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                flexShrink: 0,
              }}
            >
              Comparativo
            </Box>
            <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {getRangeLabel(startDateB, endDateB)}
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* Resumen superior total */}
      {reportData && (
        <Box sx={{ mb: 3 }}>
          
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                p: 2,
                borderRadius: 2,
                bgcolor: "#f9f9f9",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ color: "#374151", fontWeight: 700 }}
              >
                Ventas Totales
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                {formatCurrency(reportTotals.ventasActual)}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
                Comp: {formatCurrency(reportTotals.ventasComparativo)}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                p: 2,
                borderRadius: 2,
                bgcolor: "#f9f9f9",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ color: "#374151", fontWeight: 700 }}
              >
                Averías Totales
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                {formatCurrency(reportTotals.averiasValorActual)}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
                Comp: {formatCurrency(reportTotals.averiasValorComparativo)}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                p: 2,
                borderRadius: 2,
                bgcolor: "#f9f9f9",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ color: "#374151", fontWeight: 700 }}
              >
                % (Averías / Ventas) Totales
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                {totalPctAveriasVentasActual.toFixed(1)}%
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
                Comp: {totalPctAveriasVentasComparativo.toFixed(1)}%
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                p: 2,
                borderRadius: 2,
                bgcolor: "#f9f9f9",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ color: "#374151", fontWeight: 700 }}
              >
                Rentabilidad Totales
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
                {formatCurrency(reportTotals.rentabilidadActual)}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
                Comp: {formatCurrency(reportTotals.rentabilidadComparativo)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Botón flotante */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{ position: "fixed", bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>

      {/* Modal con formulario */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h6" textAlign="center" gutterBottom>
              Generar Reporte Comparativo
            </Typography>

            {/* Plataforma */}
            <FormControl fullWidth>
              <InputLabel id="platform-label">Plataforma</InputLabel>
              <Select
                labelId="platform-label"
                value={platformId}
                onChange={(e) => setPlatformId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Seleccione una plataforma</em>
                </MenuItem>
                {platforms.map((platform) => (
                  <MenuItem key={platform._id} value={platform._id}>
                    {platform.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Actual */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Desde Actual"
                type="date"
                value={startDateA}
                onChange={(e) => setStartDateA(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Hasta Actual"
                type="date"
                value={endDateA}
                onChange={(e) => setEndDateA(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            {/* Comparativo */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Desde Comparativo"
                type="date"
                value={startDateB}
                onChange={(e) => setStartDateB(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Hasta Comparativo"
                type="date"
                value={endDateB}
                onChange={(e) => setEndDateB(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            {/* Botón */}
            <Button variant="contained" color="primary" onClick={handleClose} fullWidth>
              Generar Reporte
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Gráficos */}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 0, overflowX: "auto", px: 0, py: 1 }}>
        {sortedReportData.length > 0 &&
          sortedReportData.map((cityReport) => {
            if (!cityReport.monthA || !cityReport.monthB) return null;
            return (
              <Box
                key={cityReport.city}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  minWidth: 270,
                  flexShrink: 0,
                }}
              >
                <Typography variant="h5" align="center">
                  {cityReport.city}
                </Typography>
                <ComparisonPieAlt
                  data={buildComparisonData(cityReport.monthA, cityReport.monthB)}
                  metric="ventas"
                  title="Ventas"
                  periodLabels={[periodALabel, periodBLabel]}
                />
                <ComparisonBarAlt
                  data={buildComparisonData(cityReport.monthA, cityReport.monthB)}
                  metric="averias"
                  title="Averías"
                  periodLabels={[periodALabel, periodBLabel]}
                />
                <ComparisonProgressAlt
                  data={buildComparisonData(cityReport.monthA, cityReport.monthB)}
                  metric="rentabilidad"
                  title="Rentabilidad"
                  periodLabels={[periodALabel, periodBLabel]}
                />
              </Box>
            );
          })}
      </Box>
    </Container>
  );
};
