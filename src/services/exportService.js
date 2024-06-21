import axios from 'axios';
import { saveAs } from 'file-saver';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const genericExport = async (startDate, endDate, orderDetailToExport, city) => {
  try {
    const response = await axios.post(
      `${API_URL}/exports/export-generic`,
      {
        startDate,
        endDate,
        orderDetailToExport,
        city
      },
      {
        responseType: 'blob'
      }
    );

    if (!response.data) {
      throw new Error('No se pudo descargar el archivo');
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const blob = new Blob([response.data], { type: 'application/octet-stream' });
    const name = `${orderDetailToExport}_${new Date(startDate).toLocaleDateString("es-CO")}_${new Date(endDate).toLocaleDateString("es-CO")}_${city}`;

    saveAs(blob, `${name}.xlsx`);

    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

const allShopsExport = async (startDate, endDate, orderDetailToExport, city) => {
  try {
    const response = await axios.post(
      `${API_URL}/exports/export-all-shops`,
      {
        startDate,
        endDate,
        orderDetailToExport,
        city
      },
      {
        responseType: 'blob'
      }
    );

    if (!response.data) {
      throw new Error('No se pudo descargar el archivo');
    }

    //const url = window.URL.createObjectURL(new Blob([response.data]));
    const blob = new Blob([response.data], { type: 'application/octet-stream' });
    const name = `${orderDetailToExport}_${new Date(startDate).toLocaleDateString("es-CO")}}_${new Date(endDate).toLocaleDateString("es-CO")}}_${city}`;

    saveAs(blob, `${name}.xlsx`);

    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

export { genericExport, allShopsExport };
