import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const buildFullProcessErrorMessage = (error) => {
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
    const response = await axios.post(`${API_URL}/statistics/full-process`, {
      startDate,
      endDate
    });
    return response.data;
  } catch (error) {
    const message = buildFullProcessErrorMessage(error);
    throw new Error(message);
  }
};

export { runFullProcess };