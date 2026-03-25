import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

const METRIC_COLORS = {
  ventas: { main: "#1976D2", light: "#BBDEFB" },
  averias: { main: "#D32F2F", light: "#FFCDD2" },
  rentabilidad: { main: "#388E3C", light: "#C8E6C9" },
};

const CustomTooltip = ({ active, payload, metric, position }) => {
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (active && position) {
      setTooltipPos({ x: position.x - 15, y: position.y - 40 });
    }
  }, [active, position]);

  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const real = data.real;
  const perc = data.percentage;
  const isVentasMetric = metric?.toLowerCase() === "ventas";
  const formatReal = (val) => {
    const rounded = Math.round(val);
    const abs = Math.abs(rounded).toLocaleString("es-CO");
    return isVentasMetric ? `${rounded < 0 ? "-" : ""}$${abs}` : rounded.toLocaleString("es-CO");
  };
  const displayValue =
    typeof perc === "number"
      ? `${formatReal(real)} (${perc.toFixed(0)}%)`
      : formatReal(real);

  return createPortal(
    <div
      style={{
        position: "fixed",
        left: `${tooltipPos.x}px`,
        top: `${tooltipPos.y}px`,
        backgroundColor: "#fff",
        border: `2px solid ${METRIC_COLORS[metric.toLowerCase()].main}`,
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "12px",
        fontWeight: 600,
        color: "#333",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {displayValue}
    </div>,
    document.body
  );
};

export const ComparisonPieAlt = ({ data, metric, title }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isVentas = metric === "ventas";

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

  let ventasC = null;
  let ventasA = null;
  let unidadesC = null;
  let unidadesA = null;
  let diffAC = null;
  let diffUnitsAC = null;

  if (isVentas) {
    ventasC = Math.round(Number(data[0].ventas) || 0);
    ventasA = Math.round(Number(data[1].ventas) || 0);
    unidadesC = Math.round(Number(data[0].ventasCantidad) || 0);
    unidadesA = Math.round(Number(data[1].ventasCantidad) || 0);
    diffAC = ventasA - ventasC;
    diffUnitsAC = unidadesA - unidadesC;
  }

  const percentageReal = (valueB / valueA) * 100;
  const visualPercentage = Math.max(Math.min(percentageReal, 100), 0);
  const percentageLabel = `${percentageReal.toFixed(0)}%`;

  const chartData = [
    { name: "Progreso", value: visualPercentage, real: valueB, percentage: percentageReal },
    { name: "Restante", value: 100 - visualPercentage, real: valueA - valueB },
  ];

  const formatValue = (val) => {
    if (typeof val !== "number" || Number.isNaN(val)) return "-";
    return Math.round(val).toLocaleString("es-CO");
  };

  const formatCurrency = (val) => {
    if (typeof val !== "number" || Number.isNaN(val)) return "-";
    const roundedValue = Math.round(val);
    const absoluteValue = Math.abs(roundedValue).toLocaleString("es-CO");
    return `${roundedValue < 0 ? "-" : ""}$${absoluteValue}`;
  };

  return (
    <div
      style={{
        width: "260px",
        margin: "12px auto",
        padding: "10px 8px",
        boxSizing: "border-box",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {title ? (
        <div style={{ textAlign: "center", marginBottom: 4, fontSize: 14, fontWeight: 700 }}>{title}</div>
      ) : null}

      <div
        style={{ position: "relative", width: 220, height: 200, margin: "0 auto" }}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      >
        <div
          style={{
            position: "absolute",
            top: "47%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            borderRadius: 16,
            padding: "4px 12px",
            fontSize: 13,
            fontWeight: "bold",
            color: METRIC_COLORS[metric.toLowerCase()].main,
            zIndex: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>{percentageLabel}</span>
        </div>

        <PieChart width={220} height={200}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="46%"
            innerRadius={40}
            outerRadius={80}
            label={({ cx, cy, index }) => {
              if (index === 0) {
                return (
                  <text x={cx} y={cy} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
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
                fill={index === 0 ? METRIC_COLORS[metric.toLowerCase()].main : METRIC_COLORS[metric.toLowerCase()].light}
              />
            ))}
          </Pie>

          <Tooltip
            content={<CustomTooltip metric={metric} position={mousePos} />}
            wrapperStyle={{ outline: "none", pointerEvents: "none" }}
            cursor={false}
            isAnimationActive={false}
          />

          <Legend
            wrapperStyle={{ fontSize: 11 }}
            payload={[
              {
                value: "Progreso",
                type: "square",
                color: METRIC_COLORS[metric.toLowerCase()].main,
              },
            ]}
          />
        </PieChart>
      </div>

      {isVentas && ventasC !== null && ventasA !== null ? (
        <div style={{ textAlign: "left", marginTop: 8, fontSize: 12, lineHeight: 1.35, padding: 0 }}>
          <div style={{ color: "#111827", fontWeight: 400, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ minWidth: 72 }}>V. Actual:</span>
            <span>{formatCurrency(ventasA)}</span>
            <span>|</span>
            <span>{unidadesA.toLocaleString("es-CO")} u</span>
          </div>
          <div style={{ color: "#111827", fontWeight: 400, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ minWidth: 72 }}>V. Comp:</span>
            <span>{formatCurrency(ventasC)}</span>
            <span>|</span>
            <span>{unidadesC.toLocaleString("es-CO")} u</span>
          </div>
          <div style={{ color: "#111827", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ minWidth: 72 }}>Δ Cambio:</span>
            <span style={{ color: diffAC < 0 ? "#D32F2F" : "#388E3C" }}>{formatCurrency(diffAC)}</span>
            <span>|</span>
            <span style={{ color: diffUnitsAC < 0 ? "#D32F2F" : "#388E3C" }}>{`${diffUnitsAC >= 0 ? "+" : ""}${diffUnitsAC.toLocaleString("es-CO")} u`}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const ComparisonBarAlt = ({ data, metric, title, periodLabels = ["Comparativo", "Actual"] }) => {
  if (!Array.isArray(data) || data.length < 2) {
    return <p>Sin datos</p>;
  }

  const valueComparativo = Number(data[0]?.[metric]) || 0;
  const valueActual = Number(data[1]?.[metric]) || 0;
  const averiasValorComparativo = Number(data[0]?.averiasValor) || 0;
  const averiasValorActual = Number(data[1]?.averiasValor) || 0;
  const averiasCantidadComparativo = Number(data[0]?.averiasCantidad) || valueComparativo;
  const averiasCantidadActual = Number(data[1]?.averiasCantidad) || valueActual;
  const labelComparativo = periodLabels[0] || "Comparativo";
  const labelActual = periodLabels[1] || "Actual";

  const diffAverias = valueActual - valueComparativo;
  const diffAveriasValor = averiasValorActual - averiasValorComparativo;

  const chartData = [
    {
      name: title || "Averias",
      comparativo: valueComparativo,
      actual: valueActual,
    },
  ];

  return (
    <div
      style={{
        width: "260px",
        margin: "12px auto",
        padding: "10px 8px",
        boxSizing: "border-box",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {title && <div style={{ textAlign: "center", marginBottom: 4, fontSize: 14, fontWeight: 700 }}>{title}</div>}

      <BarChart width={236} height={180} data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip formatter={(value) => Math.round(Number(value) || 0).toLocaleString("es-CO")} />
        <Legend
          wrapperStyle={{ fontSize: 11, columnGap: 8 }}
          formatter={(value) => (value === "actual" ? labelActual : labelComparativo)}
          payload={[
            { value: "actual", type: "square", color: "#D32F2F" },
            { value: "comparativo", type: "square", color: "#FF8A80" },
          ]}
        />
        <Bar dataKey="actual" fill="#D32F2F" radius={[6, 6, 0, 0]} />
        <Bar dataKey="comparativo" fill="#FF8A80" radius={[6, 6, 0, 0]} />
      </BarChart>

      <div style={{ textAlign: "left", marginTop: 8, fontSize: 12, lineHeight: 1.35, padding: 0 }}>
        <div style={{ color: "#111827", fontWeight: 400, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ minWidth: 72 }}>A. Actual:</span>
          <span>{`$${Math.round(averiasValorActual).toLocaleString("es-CO")}`}</span>
          <span>|</span>
          <span>{`${Math.round(averiasCantidadActual).toLocaleString("es-CO")} u`}</span>
        </div>
        <div style={{ color: "#111827", fontWeight: 400, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ minWidth: 72 }}>A. Comp:</span>
          <span>{`$${Math.round(averiasValorComparativo).toLocaleString("es-CO")}`}</span>
          <span>|</span>
          <span>{`${Math.round(averiasCantidadComparativo).toLocaleString("es-CO")} u`}</span>
        </div>
        <div style={{ color: "#111827", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ minWidth: 72 }}>Δ Cambio:</span>
          <span style={{ color: diffAverias < 0 ? "#388E3C" : "#D32F2F" }}>{`${diffAveriasValor < 0 ? "-" : ""}$${Math.abs(Math.round(diffAveriasValor)).toLocaleString("es-CO")}`}</span>
          <span>|</span>
          <span style={{ color: diffAverias < 0 ? "#388E3C" : "#D32F2F" }}>{`${diffAverias >= 0 ? "+" : ""}${Math.round(diffAverias).toLocaleString("es-CO")} u`}</span>
        </div>
      </div>
    </div>
  );
};

export const ComparisonProgressAlt = ({ data, metric, title, periodLabels = ["Comparativo", "Actual"] }) => {
  if (!Array.isArray(data) || data.length < 2) {
    return <p>Sin datos</p>;
  }

  const valueComparativo = Number(data[0]?.[metric]) || 0;
  const valueActual = Number(data[1]?.[metric]) || 0;
  const labelComparativo = periodLabels[0] || "Comparativo";
  const labelActual = periodLabels[1] || "Actual";

  const ratio = valueComparativo > 0 ? (valueActual / valueComparativo) * 100 : 0;
  const progress = Math.max(Math.min(ratio, 100), 0);
  const color = ratio >= 100 ? "#2E7D32" : "#388E3C";
  const diffRentabilidad = valueActual - valueComparativo;
  const pctRentabilidad = valueComparativo > 0 ? ((diffRentabilidad / valueComparativo) * 100) : 0;

  const formatCurrency = (val) => {
    if (typeof val !== "number" || Number.isNaN(val)) return "-";
    const roundedValue = Math.round(val);
    const absoluteValue = Math.abs(roundedValue).toLocaleString("es-CO");
    return `${roundedValue < 0 ? "-" : ""}$${absoluteValue}`;
  };

  return (
    <div
      style={{
        width: "260px",
        margin: "12px auto",
        padding: "10px 8px",
        boxSizing: "border-box",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {title && <div style={{ textAlign: "center", marginBottom: 4, fontSize: 14, fontWeight: 700 }}>{title}</div>}

      <div style={{ width: "100%", height: 18, borderRadius: 999, background: "#C8E6C9", overflow: "hidden" }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: color,
            transition: "width 250ms ease",
          }}
        />
      </div>

      <div style={{ marginTop: 8, textAlign: "right", color: "#111827", fontSize: 12, fontWeight: 700 }}>
        {ratio.toFixed(0)}%
      </div>

      <div style={{ textAlign: "left", marginTop: 8, fontSize: 12, lineHeight: 1.35, padding: 0 }}>
        <div style={{ color: "#111827", fontWeight: 400, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ minWidth: 72 }}>{`${labelActual === "Actual" ? "R. Actual" : labelActual}:`}</span>
          <span>{formatCurrency(valueActual)}</span>
        </div>
        <div style={{ color: "#111827", fontWeight: 400, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ minWidth: 72 }}>{`${labelComparativo === "Comparativo" ? "R. Comp" : labelComparativo}:`}</span>
          <span>{formatCurrency(valueComparativo)}</span>
        </div>
        <div style={{ color: "#111827", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ minWidth: 72 }}>Δ Cambio:</span>
          <span style={{ color: diffRentabilidad < 0 ? "#D32F2F" : "#388E3C" }}>{formatCurrency(diffRentabilidad)}</span>
          <span>|</span>
          <span style={{ color: diffRentabilidad < 0 ? "#D32F2F" : "#388E3C" }}>{`${pctRentabilidad >= 0 ? "+" : ""}${pctRentabilidad.toFixed(0)}%`}</span>
        </div>
      </div>
    </div>
  );
};
