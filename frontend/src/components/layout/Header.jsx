export default function Header() {
  return (
    <header className="py-2 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">

      {/* Título da página — pode ser dinâmico depois */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-[11px] text-gray-400 leading-none mt-0.5">Bem-vindo de volta</p>
      </div>

      {/* Área de filtros futura */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-400 text-sm cursor-pointer hover:bg-indigo-100 transition">
          ⚙
        </div>
      </div>

    </header>
  );
}