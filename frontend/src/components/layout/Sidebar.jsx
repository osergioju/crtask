import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/",           label: "Visão Geral", icon: "▦" },
  { to: "/clientes",   label: "Clientes",    icon: "◈" },
  { to: "/colaboradores",   label: "Colaboradores",    icon: "◈" },
  { to: "/sla",        label: "SLA",         icon: "◷" },
  { to: "/volume",     label: "Volume",      icon: "↗" },
  { to: "/retrabalho", label: "Retrabalho",  icon: "↺" },
];

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
    }`;

  const iconClass = (isActive) =>
    `text-base w-5 text-center transition-all ${
      isActive ? "text-indigo-500" : "text-gray-400"
    }`;

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-black">C</span>
          </div>
          <span className="font-extrabold text-gray-900 tracking-tight text-lg">CRT</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-9">Dashboard Operacional</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2">
          Menu
        </p>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} className={linkClass} end={to === "/"}>
            {({ isActive }) => (
              <>
                <span className={iconClass(isActive)}>{icon}</span>
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-[11px] text-gray-400">v1.0 · CRT Dashboard</p>
      </div>

    </aside>
  );
}