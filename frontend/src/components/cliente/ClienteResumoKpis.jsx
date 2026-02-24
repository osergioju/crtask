// components/cliente/ClienteResumoKpis.jsx

function Kpi({ label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <p className="text-xs uppercase text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default function ClienteResumoKpis({ summary }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Kpi label="Total" value={summary.total} />
      <Kpi label="Andamento" value={summary.inProgress} />
      <Kpi label="Concluídas" value={summary.concluded} />
      <Kpi label="Atrasadas" value={summary.overdue} />
      <Kpi label="Urgente" value={summary.urgente} />
    </section>
  );
}