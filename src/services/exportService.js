import axios from 'axios';
import { saveAs } from 'file-saver';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const genericExport = async (startDate, endDate, orderDetailToExport, city, cityName,detail) => {
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

    const blob = new Blob([response.data], { type: 'application/octet-stream' });
    const name = `${orderDetailToExport}_${startDate}_${endDate}_${cityName}_${detail}`;

    saveAs(blob, `${name}.xlsx`);

    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

const allShopsExport = async (startDate, endDate, orderDetailToExport, city,cityName, detail ) => {
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

    const blob = new Blob([response.data], { type: 'application/octet-stream' });
    const name = `${orderDetailToExport}_${startDate}_${endDate}_${cityName}_${detail}`;

    saveAs(blob, `${name}.xlsx`);

    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

const largeExport = async (startDate, endDate, cityId, platformId ) => {
  try {
    console.log(platformId);
    const response = await axios.post(
      `${API_URL}/exports/large-dataset`,
      {
        startDate, endDate, cityId, platformId
      },
      {
        responseType: 'blob'
      }
    );

    if (!response.data) {
      throw new Error('No se pudo descargar el archivo');
    }

    const blob = new Blob([response.data], { type: 'application/octet-stream' });
    const name = `${startDate}_${endDate}`;

    saveAs(blob, `${name}.xlsx`);

    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

export { genericExport, allShopsExport, largeExport };
