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
} from "@mui/material";
import { useState, useEffect } from "react";
import { getPlatformCitiesComparison } from "src/services/reportService";
import { getPlatforms } from "src/services/platformService";
import { ComparisonPieAlt } from "src/sections/report/ComparisonPie";
import AddIcon from "@mui/icons-material/Add";

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const PlatformCitiesComparison = () => {
  const [platformId, setPlatformId] = useState("");
  const [monthA, setMonthA] = useState(1);
  const [yearA, setYearA] = useState(2026);
  const [monthB, setMonthB] = useState(2);
  const [yearB, setYearB] = useState(2026);
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
    if (platformId) {
      fetchReport();
    }
  }, [platformId, monthA, yearA, monthB, yearB]);

  const fetchReport = async () => {
    if (!platformId || !monthA || !yearA || !monthB || !yearB) return;
    try {
      const response = await getPlatformCitiesComparison(platformId, monthA, yearA, monthB, yearB);
      setReportData(response);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const buildComparisonData = (monthAData = {}, monthBData = {}) => [
    {
      _id: { month: monthA, year: yearA },
      ventas: Number(monthAData.ventasValor) || 0,
      ventasCantidad: Number(monthAData.ventasCantidad) || 0,
      averias: Number(monthAData.averias) || 0,
      rentabilidad: Number(monthAData.rentabilidad) || 0,
    },
    {
      _id: { month: monthB, year: yearB },
      ventas: Number(monthBData.ventasValor) || 0,
      ventasCantidad: Number(monthBData.ventasCantidad) || 0,
      averias: Number(monthBData.averias) || 0,
      rentabilidad: Number(monthBData.rentabilidad) || 0,
    },
  ];

  const monthTitle = `${monthNames[Number(monthA) - 1] || ""} vs ${monthNames[Number(monthB) - 1] || ""}`;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
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

            {/* Periodo A */}
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="monthA-label">Mes A</InputLabel>
                <Select
                  labelId="monthA-label"
                  value={monthA}
                  onChange={(e) => setMonthA(e.target.value)}
                >
                  {monthNames.map((m, i) => (
                    <MenuItem key={i} value={i + 1}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="yearA-label">Año A</InputLabel>
                <Select
                  labelId="yearA-label"
                  value={yearA}
                  onChange={(e) => setYearA(e.target.value)}
                >
                  <MenuItem value={2024}>2024</MenuItem>
                  <MenuItem value={2025}>2025</MenuItem>
                  <MenuItem value={2026}>2026</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Periodo B */}
            <Stack direction="row" spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="monthB-label">Mes B</InputLabel>
                <Select
                  labelId="monthB-label"
                  value={monthB}
                  onChange={(e) => setMonthB(e.target.value)}
                >
                  {monthNames.map((m, i) => (
                    <MenuItem key={i} value={i + 1}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="yearB-label">Año B</InputLabel>
                <Select
                  labelId="yearB-label"
                  value={yearB}
                  onChange={(e) => setYearB(e.target.value)}
                >
                  <MenuItem value={2024}>2024</MenuItem>
                  <MenuItem value={2025}>2025</MenuItem>
                  <MenuItem value={2026}>2026</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {/* Botón */}
            <Button variant="contained" color="primary" onClick={fetchReport} fullWidth>
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
                <Typography variant="h5" align="center">
                  {cityReport.city}
                </Typography>
                <ComparisonPieAlt
                  data={buildComparisonData(cityReport.monthA, cityReport.monthB)}
                  metric="ventas"
                  title={monthTitle}
                />
                <ComparisonPieAlt
                  data={buildComparisonData(cityReport.monthA, cityReport.monthB)}
                  metric="averias"
                  title={monthTitle}
                />
                <ComparisonPieAlt
                  data={buildComparisonData(cityReport.monthA, cityReport.monthB)}
                  metric="rentabilidad"
                  title={monthTitle}
                />
              </Box>
            );
          })}
      </Box>
    </Container>
  );
};
