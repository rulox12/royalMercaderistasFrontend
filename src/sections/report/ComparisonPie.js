import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#6EC6FF", "#4DD0E1", "#FFB74D", "#81C784"];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
      {value}
    </text>
  );
};

const renderPercentageLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const ComparisonPieAlt = ({ data, metric, title }) => {
      // Solo para ventas: mostrar info de ambos meses y diferencia
      let ventasA = null, ventasB = null, cantidadA = null, cantidadB = null, diferencia = null, diferenciaCantidad = null;
      if (metric === "ventas" && data[0] && data[1]) {
        ventasA = Math.round(Number(data[0].ventas)).toLocaleString("es-CO");
        ventasB = Math.round(Number(data[1].ventas)).toLocaleString("es-CO");
        cantidadA = Math.round(Number(data[0].ventasCantidad)).toLocaleString("es-CO");
        cantidadB = Math.round(Number(data[1].ventasCantidad)).toLocaleString("es-CO");
        diferencia = Math.round(Number(data[0].ventas) - Number(data[1].ventas));
        diferenciaCantidad = Math.round(Number(data[0].ventasCantidad) - Number(data[1].ventasCantidad));
      }
    // Obtener cantidad vendida si es ventas
    let unidadesVendidas = null;
    if (metric === "ventas" && data[1] && data[1].ventasCantidad !== undefined) {
      unidadesVendidas = Math.round(Number(data[1].ventasCantidad)).toLocaleString("es-CO");
    }
  if (!Array.isArray(data) || data.length < 2) {
    return <p>Sin datos</p>;
  }

  const valueA = Number(data[0]?.[metric]) || 0;
  const valueB = Number(data[1]?.[metric]) || 0;

  if (valueA === 0) {
    return (
      <div style={{ textAlign: "center", width: "200px", margin: "10px auto" }}>
        <h4>{metric}</h4>
        <p>Sin datos disponibles</p>
      </div>
    );
  }

  const percentageReal = (valueB / valueA) * 100;
  let percentageB = percentageReal;
  // Para la visualización, limitamos a 100% pero mostramos el real en la etiqueta
  const visualPercentage = Math.max(Math.min(percentageB, 100), 0);

  const chartData = [
    { name: "Progreso Mes", value: visualPercentage, real: valueB, percentage: percentageReal },
    { name: "Restante", value: 100 - visualPercentage, real: valueA - valueB },
  ];

  // Format central value nicely
  const formatValue = (val) => {
    if (typeof val !== "number" || isNaN(val)) return "-";
    return Math.round(val).toLocaleString("es-CO");
  };

const METRIC_COLORS = {
  ventas: { main: "#1976D2", light: "#BBDEFB" }, // azul fuerte + azul claro
  averias: { main: "#D32F2F", light: "#FFCDD2" }, // rojo fuerte + rojo claro
  rentabilidad: { main: "#388E3C", light: "#C8E6C9" }, // verde fuerte + verde claro
};

  return (
    <div
      style={{
        width: "260px",
        margin: "20px auto",
        padding: "12px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {title && (
        <div style={{ textAlign: "center", marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
          {title}
        </div>
      )}
      <h4 style={{ textAlign: "center", marginTop: 0 }}>{metric.charAt(0).toUpperCase() + metric.slice(1)}</h4>
      <div style={{ position: 'relative', width: 250, height: 250, margin: '0 auto' }}>
        {/* Valor central encima de la torta, fondo blanco, bien formateado */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: 16,
            padding: '4px 12px',
            fontSize: 18,
            fontWeight: 'bold',
            color: METRIC_COLORS[metric.toLowerCase()].main,
            zIndex: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}
        >
          {formatValue(valueB)}
        </div>
        <PieChart width={250} height={250}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            // Mostrar el porcentaje real en la etiqueta
            if (index === 0) {
              return (
                <text
                  x={cx}
                  y={cy}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                >
                  {`${percentageReal.toFixed(0)}%`}
                </text>
              );
            }
            return null;
          }}
          labelLine={false}
          startAngle={90}
          endAngle={-270}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                index === 0
                  ? METRIC_COLORS[metric.toLowerCase()].main
                  : METRIC_COLORS[metric.toLowerCase()].light
              }
            />
          ))}
        </Pie>
        {/* Valor real en el centro, con fondo blanco y formato */}
        {/* ...existing code... */}
        <Tooltip
          formatter={(value, name, props) => {
            // Show real value and real percentage
            const real = props.payload.real;
            const perc = props.payload.percentage;
            if (typeof perc === "number") {
              return [`${real.toLocaleString("es-CO")} (${perc.toFixed(0)}%)`, name];
            }
            return [`${real.toLocaleString("es-CO")}`, name];
          }}
        />
        <Legend />
        </PieChart>
      </div>
      {/* Unidades vendidas debajo del gráfico solo para ventas */}
      {metric === "ventas" && ventasA && ventasB && cantidadA && cantidadB && (
        <div style={{ textAlign: "left", marginTop: 8, fontSize: 13, color: '#333', padding: '0 8px' }}>
          <div style={{ color: METRIC_COLORS[metric.toLowerCase()].main, fontWeight: 600 }}>
            Ventas hechas en el mes de enero: <span style={{ fontWeight: 700 }}>{ventasA}</span> ({cantidadA} unidades)
          </div>
          <div style={{ color: METRIC_COLORS[metric.toLowerCase()].main, fontWeight: 600 }}>
            Ventas hechas en el mes de febrero: <span style={{ fontWeight: 700 }}>{ventasB}</span> ({cantidadB} unidades)
          </div>
          {Number(data[1].ventas) < Number(data[0].ventas) ? (
            <div style={{ color: '#D32F2F', fontWeight: 600 }}>
              Falta a febrero para llegar a enero: <span style={{ fontWeight: 700 }}>{Math.abs(diferencia).toLocaleString("es-CO")}</span> ({Math.abs(diferenciaCantidad).toLocaleString("es-CO")} unidades)
            </div>
          ) : (
            <div style={{ color: '#388E3C', fontWeight: 600 }}>
              Febrero superó a enero por: <span style={{ fontWeight: 700 }}>{Math.abs(diferencia).toLocaleString("es-CO")}</span> ({Math.abs(diferenciaCantidad).toLocaleString("es-CO")} unidades)
            </div>
          )}
        </div>
      )}
    </div>
  );
};
