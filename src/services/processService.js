import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FULL_PROCESS_CHUNK_DAYS = Number(process.env.NEXT_PUBLIC_FULL_PROCESS_CHUNK_DAYS || 3);

const toDate = (value) => new Date(`${value}T00:00:00`);
const toISO = (date) => date.toISOString().slice(0, 10);

const splitDateRange = (startDate, endDate, chunkDays) => {
  const chunks = [];
  let cursor = toDate(startDate);
  const lastDate = toDate(endDate);

  while (cursor <= lastDate) {
    const chunkStart = new Date(cursor);
    const chunkEnd = new Date(cursor);
    chunkEnd.setDate(chunkEnd.getDate() + chunkDays - 1);

    if (chunkEnd > lastDate) {
      chunkEnd.setTime(lastDate.getTime());
    }

    chunks.push({
      startDate: toISO(chunkStart),
      endDate: toISO(chunkEnd),
    });

    cursor = new Date(chunkEnd);
    cursor.setDate(cursor.getDate() + 1);
  }

  return chunks;
};

const buildFullProcessErrorMessage = (error) => {
  const apiUrl = API_URL || 'NO_DEFINIDA';

  if (error?.code === 'ERR_NETWORK') {
    return `No se pudo conectar al API (${apiUrl}). Para rangos grandes puede ser timeout de proxy o caída temporal del backend.`;
  }

  if (error?.code === 'ECONNABORTED') {
    return `La solicitud excedió el tiempo límite contra el API (${apiUrl}).`;
  }

  const status = error?.response?.status;
  const payload = error?.response?.data;

  const backendMessage =
    payload?.error ||
    payload?.message ||
    payload?.details;

  if (backendMessage) {
    return status ? `[HTTP ${status}] ${backendMessage}` : backendMessage;
  }

  if (typeof payload === 'string' && payload.trim()) {
    const trimmedPayload = payload.replace(/\s+/g, ' ').trim();
    return status
      ? `[HTTP ${status}] ${trimmedPayload.slice(0, 240)}`
      : trimmedPayload.slice(0, 240);
  }

  if (error?.message) {
    return error.message;
  }

  return 'Error ejecutando full process';
};

const runFullProcess = async (startDate, endDate) => {
  try {
    const chunkDays = Number.isFinite(FULL_PROCESS_CHUNK_DAYS) && FULL_PROCESS_CHUNK_DAYS > 0
      ? FULL_PROCESS_CHUNK_DAYS
      : 3;

    const chunks = splitDateRange(startDate, endDate, chunkDays);

    if (chunks.length === 1) {
      const response = await axios.post(`${API_URL}/statistics/full-process`, {
        startDate,
        endDate
      }, {
        timeout: 0,
      });
      return response.data;
    }

    const aggregatedSteps = [];
    let success = 0;
    let failed = 0;

    for (const chunk of chunks) {
      const response = await axios.post(`${API_URL}/statistics/full-process`, {
        startDate: chunk.startDate,
        endDate: chunk.endDate,
      }, {
        timeout: 0,
      });

      const data = response.data;
      const chunkLabel = `${chunk.startDate} a ${chunk.endDate}`;

      const steps = (data?.steps || []).map((step) => ({
        ...step,
        step: `${step.step} (${chunkLabel})`,
      }));

      aggregatedSteps.push(...steps);
      success += Number(data?.summary?.success || 0);
      failed += Number(data?.summary?.failed || 0);
    }

    return {
      ok: success > 0,
      startDate,
      endDate,
      summary: {
        total: aggregatedSteps.length,
        success,
        failed,
        message: `${success} completado(s), ${failed} fallido(s) en ${chunks.length} bloque(s)`,
      },
      steps: aggregatedSteps,
    };
  } catch (error) {
    const message = buildFullProcessErrorMessage(error);
    throw new Error(message);
  }
};

export { runFullProcess };