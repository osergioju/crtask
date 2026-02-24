// components/cliente/ClienteSLA.jsx

export default function ClienteSLA({ slaHoras }) {
  const dias = (slaHoras / 24).toFixed(1);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
        SLA Médio
      </h3>

      <p className="text-3xl font-bold text-indigo-600">
        {dias} dias
      </p>

      <p className="text-xs text-gray-400 mt-2">
        Tempo médio da entrada até conclusão
      </p>
    </div>
  );
}