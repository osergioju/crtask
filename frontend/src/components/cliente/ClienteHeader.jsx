// components/cliente/ClienteHeader.jsx

export default function ClienteHeader({ name }) {
  return (
    <header className="border-b border-gray-200 pb-6">
      <p className="text-xs uppercase tracking-widest text-indigo-500 mb-1">
        CRT · Cliente
      </p>
      <h1 className="text-3xl font-bold text-gray-900">
        {name}
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        Visão estratégica e operacional
      </p>
    </header>
  );
}