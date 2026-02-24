// frontend/src/pages/Clientes.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getClientes } from "../service/api.js";
import RankingTable from "../components/RankingTable"

/* ─── Colunas ───────────────────────────────────────── */

const COLUMNS = [
  { key: "name",              label: "Cliente",      align: "left"  },
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

/* ─── Badge Colors ─────────────────────────────────── */

function getBadgeClass(key, value) {
  const v = Number(value);

  if (key === "overdue")    return v > 0 ? "bg-red-100 text-red-700"       : "bg-gray-100 text-gray-400";
  if (key === "urgente")    return v > 0 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-400";
  if (key === "backlog")    return v > 0 ? "bg-sky-100 text-sky-700"       : "bg-gray-100 text-gray-400";
  if (key === "retrabalho") return v > 0 ? "bg-amber-100 text-amber-700"   : "bg-gray-100 text-gray-400";
  if (key === "concluded")  return v > 0 ? "bg-green-100 text-green-700"   : "bg-gray-100 text-gray-400";

  if (key === "retrabalhoPercent") {
    if (v >= 30) return "bg-red-100 text-red-700";
    if (v >= 15) return "bg-amber-100 text-amber-700";
    return "bg-green-100 text-green-700";
  }

  return "bg-gray-100 text-gray-600";
}

/* ─── Avatar Cliente ───────────────────────────────── */

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

/* ─── Página Principal ─────────────────────────────── */

export default function Clientes() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [sortKey, setSortKey] = useState("total");
  const [sortDir, setSortDir] = useState("desc");
  const [search, setSearch]   = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    getClientes()
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

    if (search.trim()) {
      filtered = filtered.filter((r) =>
        r.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return [...filtered].sort((a, b) => {
      const aVal = sortKey === "name"
        ? a.name
        : Number(a.summary?.[sortKey] ?? 0);

      const bVal = sortKey === "name"
        ? b.name
        : Number(b.summary?.[sortKey] ?? 0);

      if (typeof aVal === "string")
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);

      return sortDir === "asc"
        ? aVal - bVal
        : bVal - aVal;
    });

  }, [data, search, sortKey, sortDir]);

  return (
    <div className="min-h-screen space-y-8">

      {/* Header */}
      <header className="flex items-end justify-between border-b border-gray-200 pb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-1">
            CRT · Clientes
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Visão por Cliente
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Volume, atrasos e qualidade por cliente
          </p>
        </div>
      </header>

      {/* KPI Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <KpiCard label="Clientes"      value={loading ? "—" : data.length} accent="gray"   />
        <KpiCard label="Tasks Abertas" value={loading ? "—" : totals.total} accent="indigo" />
        <KpiCard label="Em Atraso"     value={loading ? "—" : totals.overdue} accent="red" />
        <KpiCard label="Retrabalho"    value={loading ? "—" : totals.retrabalho} accent="amber" />
        <KpiCard label="Urgentes"    value={loading ? "—" : totals.urgente} accent="black" />
      </section>

      {/* Busca */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 w-64 shadow-sm focus:outline-none focus:border-indigo-300"
        />
        <span className="text-xs text-gray-400">
          {rows.length} cliente{rows.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer
                      ${col.align === "right" ? "text-right" : "text-left"}
                      ${sortKey === col.key ? "text-indigo-500" : "text-gray-400"}
                    `}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.clientID}
                  onClick={() => navigate(`/cliente/${row.clientID}`)}
                  className="group border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                >
                  {COLUMNS.map((col) => {
                    const value =
                      col.key === "name"
                        ? row.name
                        : row.summary?.[col.key];

                    return (
                      <td key={col.key} className={`px-4 py-3 ${col.align === "right" ? "text-right" : ""}`}>
                        {col.key === "name" ? (
                          <div className="flex items-center gap-2.5">
                            <Avatar name={row.name} />
                            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                              {row.name}
                            </span>
                          </div>
                        ) : col.key === "total" || col.key === "inProgress" || col.key === "intime" ? (
                          <span className="text-sm font-semibold text-gray-700 tabular-nums">
                            {value ?? "—"}
                          </span>
                        ) : (
                          <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${getBadgeClass(col.key, value)}`}>
                            {col.key === "retrabalhoPercent"
                              ? `${value ?? 0}%`
                              : (value ?? "—")}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Ranking de Risco
        </h2>

        <RankingTable />
      </section>

    </div>
  );
}

/* ─── KpiCard ───────────────────────────────────── */

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