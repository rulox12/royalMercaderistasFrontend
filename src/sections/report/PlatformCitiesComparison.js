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
import { ComparisonPieAlt } from "src/sections/report/ComparisonPie";
import AddIcon from "@mui/icons-material/Add";

export const PlatformCitiesComparison = () => {
  const today = new Date().toISOString().split("T")[0];
  
  // Calcular fechas por defecto
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Periodo A: mes anterior completo
  const prevMonthStart = new Date(currentYear, currentMonth - 1, 1).toISOString().split("T")[0];
  const prevMonthEnd = new Date(currentYear, currentMonth, 0).toISOString().split("T")[0];
  
  // Periodo B: del 1 del mes actual hasta hoy
  const currentMonthStart = new Date(currentYear, currentMonth, 1).toISOString().split("T")[0];
  const currentMonthEnd = today;
  
  const [platformId, setPlatformId] = useState("");
  const [startDateA, setStartDateA] = useState(prevMonthStart);
  const [endDateA, setEndDateA] = useState(prevMonthEnd);
  const [startDateB, setStartDateB] = useState(currentMonthStart);
  const [endDateB, setEndDateB] = useState(currentMonthEnd);
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
      rentabilidad: Number(monthAData.rentabilidad) || 0,
    },
    {
      _id: { startDate: startDateB, endDate: endDateB },
      ventas: Number(monthBData.ventasValor) || 0,
      ventasCantidad: Number(monthBData.ventasCantidad) || 0,
      averias: Number(monthBData.averias) || 0,
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

  const periodATitle = `PERIODO A: ${getRangeLabel(startDateA, endDateA)}`;
  const periodBTitle = `PERIODO B: ${getRangeLabel(startDateB, endDateB)}`;
  const periodALabel = "Periodo A";
  const periodBLabel = "Periodo B";

  return (
      <Container
        maxWidth="xl"
        sx={{ mt: 4 }}
      >
      {/* Títulos de períodos */}
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
      <Modal
        open={open}
        onClose={handleClose}
      >
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
            <Typography
              variant="h6"
              textAlign="center"
              gutterBottom
            >
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
                  <MenuItem
                    key={platform._id}
                    value={platform._id}
                  >
                    {platform.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Periodo A */}
            <Stack
              direction="row"
              spacing={2}
            >
              <TextField
                fullWidth
                label="Desde A"
                type="date"
                value={startDateA}
                onChange={(e) => setStartDateA(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Hasta A"
                type="date"
                value={endDateA}
                onChange={(e) => setEndDateA(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            {/* Periodo B */}
            <Stack
              direction="row"
              spacing={2}
            >
              <TextField
                fullWidth
                label="Desde B"
                type="date"
                value={startDateB}
                onChange={(e) => setStartDateB(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Hasta B"
                type="date"
                value={endDateB}
                onChange={(e) => setEndDateB(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            {/* Botón */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleClose}
              fullWidth
            >
              Generar Reporte
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Gráficos */}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 4, overflowX: "auto", p: 2 }}>
        {reportData &&
          reportData.map((cityReport) => {
            if (!cityReport.monthA || !cityReport.monthB) return null;
            return (
              <Box
                key={cityReport.city}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  minWidth: 300,
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="h5"
                  align="center"
                >
                  {cityReport.city}
                </Typography>
                <ComparisonPieAlt
                  data={buildComparisonData(cityReport.monthA, cityReport.monthB)}
                  metric="ventas"
                  title="Ventas"
                  periodLabels={[periodALabel, periodBLabel]}
                />
                <ComparisonPieAlt
                  data={buildComparisonData(cityReport.monthA, cityReport.monthB)}
                  metric="averias"
                  title="Averías"
                  periodLabels={[periodALabel, periodBLabel]}
                />
                <ComparisonPieAlt
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
