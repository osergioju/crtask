// frontend/src/components/risk/RiskBadge.jsx

export default function RiskBadge({ level }) {
  const styles = {
    critico: "bg-red-100 text-red-700",
    atencao: "bg-amber-100 text-amber-700",
    saudavel: "bg-emerald-100 text-emerald-700",
  };

  const labels = {
    critico: "Crítico",
    atencao: "Atenção",
    saudavel: "Saudável",
  };

  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        styles[level] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[level] || "—"}
    </span>
  );
}