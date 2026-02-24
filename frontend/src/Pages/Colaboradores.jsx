// frontend/src/pages/Colaboradores.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getPessoas } from "../service/api.js";

// ─── Constantes de gestão (mesmas do DashboardHome) ───────────────────────────
const MANAGERS = ["Michelle", "Sérgio", "Isabel", "Giu"];

// ─── Colunas da tabela ────────────────────────────────────────────────────────
const COLUMNS = [
  { key: "name",              label: "Colaborador",  align: "left"  },
  { key: "total",             label: "Total",        align: "right" },
  { key: "inProgress",        label: "Andamento",    align: "right" },
  { key: "concluded",         label: "Concluídas",   align: "right" },
  { key: "overdue",           label: "Atrasadas",    align: "right" },
  { key: "intime",            label: "No Prazo",     align: "right" },
  { key: "backlog",           label: "Backlog",      align: "right" },
  { key: "retrabalho",        label: "Retrabalho",   align: "right" },
  { key: "retrabalhoPercent", label: "% Retrab.",    align: "right" },
  { key: "urgente",           label: "Urgente",      align: "right" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getBadgeClass(key, value) {
  const v = Number(value);
  if (key === "overdue")           return v > 0 ? "bg-red-100 text-red-700"       : "bg-gray-100 text-gray-400";
  if (key === "urgente")           return v > 0 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-400";
  if (key === "backlog")           return v > 0 ? "bg-sky-100 text-sky-700"       : "bg-gray-100 text-gray-400";
  if (key === "retrabalho")        return v > 0 ? "bg-amber-100 text-amber-700"   : "bg-gray-100 text-gray-400";
  if (key === "concluded")         return v > 0 ? "bg-green-100 text-green-700"   : "bg-gray-100 text-gray-400";
  if (key === "retrabalhoPercent") {
    if (v >= 30) return "bg-red-100 text-red-700";
    if (v >= 15) return "bg-amber-100 text-amber-700";
    return "bg-green-100 text-green-700";
  }
  return "bg-gray-100 text-gray-600";
}

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const palettes = [
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-sky-100 text-sky-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
  ];
  const color = palettes[name.charCodeAt(0) % palettes.length];

  return (
    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
      {initials}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {COLUMNS.map((c) => (
        <td key={c.key} className="px-4 py-3">
          <div
            className="h-4 rounded-full bg-gray-100 animate-pulse"
            style={{
              width: c.key === "name" ? "130px" : "32px",
              marginLeft: c.align === "right" ? "auto" : 0,
            }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Colaboradores() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [sortKey, setSortKey] = useState("total");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch]   = useState("");
  const [tab, setTab]         = useState("todos");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPessoas()
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const totals = useMemo(() =>
    data.reduce(
      (acc, r) => ({
        total:      acc.total      + (r.summary?.total      || 0),
        overdue:    acc.overdue    + (r.summary?.overdue    || 0),
        retrabalho: acc.retrabalho + (r.summary?.retrabalho || 0),
        urgente:    acc.urgente    + (r.summary?.urgente    || 0),
      }),
      { total: 0, overdue: 0, retrabalho: 0, urgente: 0 }
    ),
  [data]);

  const rows = useMemo(() => {
    let filtered = data;
    if (tab === "gerencia") filtered = filtered.filter((r) =>  MANAGERS.includes(r.ownerUserLogin));
    if (tab === "operacao") filtered = filtered.filter((r) => !MANAGERS.includes(r.ownerUserLogin));
    if (search.trim())      filtered = filtered.filter((r) =>  r.name?.toLowerCase().includes(search.toLowerCase()));

    return [...filtered].sort((a, b) => {
      const aVal = sortKey === "name" ? a.name : Number(a.summary?.[sortKey] ?? 0);
      const bVal = sortKey === "name" ? b.name : Number(b.summary?.[sortKey] ?? 0);
      if (typeof aVal === "string")
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [data, tab, search, sortKey, sortDir]);

  return (
    <div className="min-h-screen space-y-8">

      {/* ── Header ── */}
      <header className="flex items-end justify-between border-b border-gray-200 pb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-1">
            CRT · Colaboradores
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Visão por Pessoa
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Carga, atrasos e qualidade de entrega por colaborador
          </p>
        </div>
        <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
          Atualizado agora
        </span>
      </header>

      {/* ── KPI Strip ── */}
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <KpiCard label="Colaboradores" value={loading ? "—" : data.length}       accent="gray"   />
        <KpiCard label="Tasks Abertas" value={loading ? "—" : totals.total}      accent="indigo" />
        <KpiCard label="Em Atraso"     value={loading ? "—" : totals.overdue}    accent="red"    />
        <KpiCard label="Retrabalhos"   value={loading ? "—" : totals.retrabalho} accent="amber"  />
        <KpiCard label="Urgentes"   value={loading ? "—" : totals.urgente} accent="black"  />
      </section>

      {/* ── Controles ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        {/* Tabs — mesma estética dos cards de grupo do DashboardHome */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {[
            { id: "todos",    label: "Todos"    },
            { id: "gerencia", label: "Gerência" },
            { id: "operacao", label: "Operação" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                tab === t.id
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!loading && !error && (
            <span className="text-xs text-gray-400">
              {rows.length} colaborador{rows.length !== 1 ? "es" : ""}
            </span>
          )}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm pointer-events-none select-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl pl-8 pr-3 py-2 w-44 focus:outline-none focus:border-indigo-300 shadow-sm placeholder-gray-300"
            />
          </div>
        </div>
      </div>

      {/* ── Tabela ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-4xl mb-3">⚠️</span>
            <p className="text-sm font-medium text-gray-500">Erro ao carregar dados</p>
            <p className="text-xs text-gray-400 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-xs text-indigo-500 hover:text-indigo-700 underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  {COLUMNS.map((col) => {
                    const isActive = sortKey === col.key;
                    return (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap cursor-pointer select-none transition-colors duration-150
                          ${col.align === "right" ? "text-right" : "text-left"}
                          ${isActive ? "text-indigo-500" : "text-gray-400 hover:text-gray-600"}
                        `}
                      >
                        {col.label}
                        <span className="ml-1 opacity-50">
                          {isActive ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={COLUMNS.length}
                      className="text-center py-16 text-gray-300 text-sm"
                    >
                      Nenhum colaborador encontrado.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.ownerUserID}
                      onClick={() => navigate(`/pessoa/${encodeURIComponent(row.ownerUserID)}`)}
                      className="group border-b border-gray-50 hover:bg-gray-50/80 active:bg-gray-100 cursor-pointer transition-colors duration-100"
                    >
                      {COLUMNS.map((col) => {
                        const value =
                          col.key === "name"
                            ? row.name
                            : row.summary?.[col.key];

                        return (
                          <td
                            key={col.key}
                            className={`px-4 py-3 ${col.align === "right" ? "text-right" : ""}`}
                          >
                            {/* Coluna nome */}
                            {col.key === "name" ? (
                              <div className="flex items-center gap-2.5">
                                <Avatar name={row.name} />
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                                    {row.name}
                                  </span>
                                  {MANAGERS.includes(row.ownerUserLogin) && (
                                    <span className="text-xs bg-indigo-50 text-indigo-400 px-1.5 py-0.5 rounded-full leading-none">
                                      gestão
                                    </span>
                                  )}
                                </div>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 text-xs">
                                  →
                                </span>
                              </div>

                            /* Colunas numéricas neutras */
                            ) : col.key === "total" || col.key === "inProgress" || col.key === "intime" ? (
                              <span className="text-sm font-semibold text-gray-700 tabular-nums">
                                {value ?? "—"}
                              </span>

                            /* Colunas com badge colorido */
                            ) : (
                              <span
                                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full tabular-nums ${getBadgeClass(col.key, value)}`}
                              >
                                {col.key === "retrabalhoPercent"
                                  ? `${value ?? 0}%`
                                  : (value ?? "—")}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

// ─── KpiCard — copiado do DashboardHome para manter identidade visual ─────────
function KpiCard({ label, value, accent = "gray" }) {
  const colors = {
    gray:   "border-gray-200 bg-white",
    indigo: "border-indigo-200 bg-indigo-50",
    red:    "border-red-200 bg-red-50",
    amber:  "border-amber-200 bg-amber-50",
    black: "bg-[#ff0000] text-white"
  };

  const textColors = {
    gray:   "text-gray-800",
    indigo: "text-indigo-700",
    red:    "text-red-600",
    amber:  "text-amber-600",
    black: "text-white"
  };

  return (
    <div className={`flex flex-col items-start rounded-2xl border p-5 shadow-sm ${colors[accent]}`}>
      <p className="px-2 bg-white text-xs font-medium text-gray-500 uppercase mb-1">{label}</p>
      <p className={`text-3xl font-extrabold tabular-nums ${textColors[accent]}`}>{value}</p>
    </div>
  );
}