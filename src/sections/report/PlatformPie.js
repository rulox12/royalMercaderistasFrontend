import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';

const ApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => null
});

export const Chart = styled(ApexChart)``;

export const PlatformPie = ({ data, metric }) => {
  if (!Array.isArray(data) || data.length < 1) return null;

  const labels = data
    .map(item => (item?.platform ? String(item.platform) : 'Sin nombre'))
    .filter(label => label !== undefined);

  const values = data
    .map(item => {
      const val = item?.[metric];
      const num = Number(val);
      return Number.isFinite(num) ? num : 0;
    })
    .filter(val => val !== undefined);

  if (labels.length !== values.length || labels.length === 0) {
    console.warn('Datos inválidos para ApexCharts', { labels, values });
    return null;
  }

  const options = {
    chart: { type: 'pie' },
    labels,
    legend: { position: 'bottom' },
    colors: ['#4BC0C0', '#36A2EB', '#FF6384', '#FFCE56'],
    tooltip: {
      y: { formatter: (val) => (val !== undefined ? val.toString() : '0') }
    }
  };

  return (
    <div style={{ width: '350px', margin: '20px auto' }}>
      <h4 style={{ textAlign: 'center' }}>
        {metric.charAt(0).toUpperCase() + metric.slice(1)}
      </h4>
      <div style={{ width: '350px', margin: '20px auto' }}>
        <Chart options={options} series={values} type="pie" height={300} width={350} />
      </div>
    </div>
  );
};

PlatformPie.propTypes = {
  data: PropTypes.array.isRequired,
  metric: PropTypes.oneOf(['ventas', 'averias', 'rentabilidad']).isRequired
};