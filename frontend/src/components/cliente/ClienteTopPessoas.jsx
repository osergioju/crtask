// components/cliente/ClienteTopPessoas.jsx

export default function ClienteTopPessoas({ pessoas }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
        Top Pessoas Envolvidas
      </h3>

      <div className="space-y-3">
        {pessoas.map((p, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-700">{p.name}</span>
            <span className="font-semibold text-gray-900">
              {p.total} tasks
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}