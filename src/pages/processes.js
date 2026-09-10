import Head from 'next/head';
import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { getSalesCalculationLogs, runFullProcess } from 'src/services/processService';

const toISODate = (date) => date.toISOString().split('T')[0];

const getDefaultRange = () => {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let startDate;
  let endDate;

  if (currentDay <= 25) {
    startDate = new Date(currentYear, currentMonth - 1, 26);
    endDate = new Date(currentYear, currentMonth, 25);
  } else {
    startDate = new Date(currentYear, currentMonth, 26);
    const nextCutoffDate = new Date(currentYear, currentMonth + 1, 25);
    endDate = now < nextCutoffDate ? now : nextCutoffDate;
  }

  return {
    startDate: toISODate(startDate),
    endDate: toISODate(endDate),
  };
};

const getLatestBySource = (logs, source) => logs
  .filter((log) => log.source === source)
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;

const buildComparisonRows = (logs) => {
  const groups = new Map();
  logs.forEach((log) => {
    const key = `${log.targetDate}-${log.shop}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(log);
  });

  return Array.from(groups.values()).map((group) => {
    const automatic = getLatestBySource(group, 'scheduled_job');
    const manual = getLatestBySource(group, 'manual_admin');
    const automaticValues = new Map((automatic?.calculations || []).map((item) => [String(item.product), item]));
    const manualValues = new Map((manual?.calculations || []).map((item) => [String(item.product), item]));
    const products = new Set([...automaticValues.keys(), ...manualValues.keys()]);
    const details = Array.from(products).map((product) => ({
      product,
      automatic: automaticValues.get(product),
      manual: manualValues.get(product),
      difference: (manualValues.get(product)?.venta ?? null) - (automaticValues.get(product)?.venta ?? null),
    }));
    const differences = details.filter((detail) => detail.automatic?.venta !== detail.manual?.venta).length;

    return {
      key: `${group[0].targetDate}-${group[0].shop}`,
      targetDate: group[0].targetDate,
      shop: group[0].shop,
      automatic,
      manual,
      differences,
      details,
    };
  }).sort((a, b) => b.targetDate.localeCompare(a.targetDate));
};

const Page = () => {
  const defaults = useMemo(() => getDefaultRange(), []);
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState(null);
  const [auditDate, setAuditDate] = useState('');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [expandedAuditRows, setExpandedAuditRows] = useState({});

  const loadAudit = async () => {
    setAuditLoading(true);
    setAuditError('');
    try {
      const logs = await getSalesCalculationLogs(auditDate ? { targetDate: auditDate, limit: 200 } : { limit: 200 });
      setAuditLogs(logs);
    } catch (auditRequestError) {
      setAuditError(auditRequestError.response?.data?.error || auditRequestError.message);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    getSalesCalculationLogs({ limit: 200 })
      .then(setAuditLogs)
      .catch((auditRequestError) => {
        setAuditError(auditRequestError.response?.data?.error || auditRequestError.message);
      });
  }, []);

  const handleRun = async () => {
    setError('');
    setSuccess('');
    setResult(null);

    if (!startDate || !endDate) {
      setError('Debes ingresar fecha inicio y fecha fin');
      return;
    }

    if (startDate > endDate) {
      setError('La fecha inicio debe ser menor o igual a la fecha fin');
      return;
    }

    setLoading(true);
    try {
      const response = await runFullProcess(startDate, endDate);
      setResult(response);
      setSuccess(`✅ ${response.summary.message}`);
    } catch (runError) {
      setError(runError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Procesos | Royal fruit</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Stack spacing={3}>
            <Typography variant="h4">Procesos</Typography>

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">Full Process</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Ejecuta secuencialmente: recibidas, ventas y rentabilidad para el rango seleccionado.
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Fecha inicio"
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      label="Fecha fin"
                      type="date"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>

                  {error ? <Alert severity="error">{error}</Alert> : null}
                  {success ? <Alert severity="success">{success}</Alert> : null}

                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleRun}
                      disabled={loading}
                      fullWidth
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Ejecutando...
                        </>
                      ) : (
                        'Ejecutar Full Process'
                      )}
                    </Button>
                  </Box>

                  {result && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                        Detalle de ejecución:
                      </Typography>
                      <List>
                        {result.steps.map((step, idx) => (
                          <ListItem
                            key={idx}
                            sx={{
                              py: 1.5,
                              px: 1.5,
                              bgcolor: step.ok ? '#f1f8f4' : '#fdf0f0',
                              mb: 1,
                              borderRadius: 1,
                              border: `1px solid ${step.ok ? '#c8e6c9' : '#ffcdd2'}`,
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              {step.ok ? (
                                <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
                              ) : (
                                <ErrorIcon sx={{ color: '#c62828', fontSize: 28 }} />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                  {step.step.charAt(0).toUpperCase() + step.step.slice(1)}: {step.status}
                                </Typography>
                              }
                              secondary={
                                step.error ? (
                                  <Typography variant="caption" sx={{ color: '#c62828', display: 'block' }}>
                                    {step.error}
                                  </Typography>
                                ) : step.stdout ? (
                                  <Typography variant="caption" sx={{ color: '#616161', display: 'block', fontSize: '0.75rem' }}>
                                    {step.stdout.substring(0, 120)}
                                    {step.stdout.length > 120 ? '...' : ''}
                                  </Typography>
                                ) : null
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">Comparación de cálculo de ventas</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Compara la última ejecución automática y manual por fecha y tienda.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Fecha a revisar"
                      type="date"
                      value={auditDate}
                      onChange={(event) => setAuditDate(event.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                    <Button variant="outlined" onClick={loadAudit} disabled={auditLoading}>
                      {auditLoading ? <CircularProgress size={20} /> : 'Consultar auditoría'}
                    </Button>
                  </Stack>
                  {auditError ? <Alert severity="error">{auditError}</Alert> : null}
                  <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
                    <Table size="small" sx={{ minWidth: 760 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Fecha</TableCell>
                          <TableCell>Tienda</TableCell>
                          <TableCell>Automático</TableCell>
                          <TableCell>Manual</TableCell>
                          <TableCell>Productos diferentes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {buildComparisonRows(auditLogs).map((row) => (
                          <Fragment key={row.key}>
                            <TableRow>
                              <TableCell>
                                <IconButton
                                  size="small"
                                  onClick={() => setExpandedAuditRows((current) => ({
                                    ...current,
                                    [row.key]: !current[row.key],
                                  }))}
                                >
                                  {expandedAuditRows[row.key] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                                {row.targetDate}
                              </TableCell>
                              <TableCell>{String(row.shop)}</TableCell>
                              <TableCell>{row.automatic ? `${row.automatic.status} (${row.automatic.calculations?.length || 0})` : 'Sin registro'}</TableCell>
                              <TableCell>{row.manual ? `${row.manual.status} (${row.manual.calculations?.length || 0})` : 'Sin registro'}</TableCell>
                              <TableCell>{row.differences}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={5} sx={{ py: 0 }}>
                                <Collapse in={expandedAuditRows[row.key]} timeout="auto" unmountOnExit>
                                  <Box sx={{ py: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                      Detalle por producto
                                    </Typography>
                                    <Table size="small" sx={{ minWidth: 760 }}>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Producto</TableCell>
                                          <TableCell>Venta automática</TableCell>
                                          <TableCell>Venta manual</TableCell>
                                          <TableCell>Diferencia</TableCell>
                                          <TableCell>Valores usados</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {row.details.map((detail) => (
                                          <TableRow key={detail.product} sx={{ bgcolor: detail.difference !== 0 ? '#fff8e1' : undefined }}>
                                            <TableCell>{detail.product}</TableCell>
                                            <TableCell>{detail.automatic?.venta ?? 'Sin registro'}</TableCell>
                                            <TableCell>{detail.manual?.venta ?? 'Sin registro'}</TableCell>
                                            <TableCell>{detail.difference || 0}</TableCell>
                                            <TableCell>
                                              {detail.manual || detail.automatic
                                                ? `INVE ${detail.manual?.inveInicial ?? detail.automatic?.inveInicial ?? '-'} / AVER ${detail.manual?.averiaInicial ?? detail.automatic?.averiaInicial ?? '-'} / RECI ${detail.manual?.recibidoInicial ?? detail.automatic?.recibidoInicial ?? '-'} / INVE final ${detail.manual?.inveFinal ?? detail.automatic?.inveFinal ?? '-'}`
                                                : '-'}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </Fragment>
                        ))}
                        {!auditLoading && auditLogs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5}>No hay registros de auditoría.</TableCell>
                          </TableRow>
                        ) : null}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;