import { useEffect, useState } from "react";
import { getKpis } from "../service/api.js";
import { useNavigate } from "react-router-dom";
import RankingCard from "../components/RankingCard";
const MANAGERS = ["Michelle", "Sérgio", "Isabel", "Giu"];

const PALETTE = {
  red:   { bg: "bg-red-50",   text: "text-red-600",   bar: "bg-red-400",   badge: "bg-red-100 text-red-700"   },
  green: { bg: "bg-green-50", text: "text-green-600", bar: "bg-green-400", badge: "bg-green-100 text-green-700" },
  cyan:  { bg: "bg-sky-50",   text: "text-sky-600",   bar: "bg-sky-400",   badge: "bg-sky-100 text-sky-700"    },
  gray:  { bg: "bg-gray-50",  text: "text-gray-600",  bar: "bg-gray-300",  badge: "bg-gray-100 text-gray-600"  },
};


const DONUT_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function DashboardHome() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getKpis();
        setData(response);
      } catch (error) {
        console.error("Erro ao buscar KPIs:", error);
      }
    }
    fetchData();
  }, []);

  if (!data)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex gap-2 items-center text-gray-400 text-sm font-medium">
          <span className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-indigo-500 animate-spin" />
          Carregando dados…
        </div>
      </div>
    );

  const summary = data.summary ?? {};
  const byOwner = Array.isArray(data.byOwner) ? data.byOwner : [];

  const management = byOwner.filter((o) => MANAGERS.includes(o.ownerUserLogin));
  const operation  = byOwner.filter((o) => !MANAGERS.includes(o.ownerUserLogin));

  const avg = (arr) =>
    arr.length ? arr.reduce((a, o) => a + o.count, 0) / arr.length : 0;

  const avgManagement = avg(management);
  const avgOperation  = avg(operation);

  const allCounts = byOwner.map((o) => o.count);
  const globalAvg = allCounts.reduce((a, b) => a + b, 0) / (allCounts.length || 1);
  const stdDev = Math.sqrt(
    allCounts.reduce((acc, c) => acc + Math.pow(c - globalAvg, 2), 0) /
      (allCounts.length || 1)
  );
  const balanceScore = Math.max(0, 100 - stdDev * 5).toFixed(0);

  const performanceScore =
    summary.total > 0
      ? ((summary.intime / summary.total) * 100).toFixed(0)
      : 100;

  const perfColor = performanceScore < 70 ? "text-red-500" : "text-emerald-500";

  return (
    <div className="min-h-screen space-y-8">

      {/* ── Header ── */}
      <header className="flex items-end justify-between border-b border-gray-200 pb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-1">
            CRT · Painel de Controle
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Visão Geral
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Panorama das demandas e desempenho do time
          </p>
        </div>
        <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
          Atualizado agora
        </span>
      </header>

      {/* ── KPI Strip ── */}
      <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-4">
        <KpiCard label="Total Abertas"  value={summary.total      ?? 0} />
        <KpiCard label="Em Andamento"   value={summary.inProgress ?? 0} accent="indigo" />
        <KpiCard label="Em Atraso"      value={summary.overdue    ?? 0} accent="red"    />
        <KpiCard label="Em Dia"         value={summary.intime     ?? 0} accent="green"  />
        <KpiCard label="Backlog"        value={summary.backlog    ?? 0} accent="amber"  />
        <KpiCard label="Retrabalho"        value={summary.retrabalho    ?? 0} accent="redStrong"  />
        <KpiCard label="Urgente"        value={summary.urgente    ?? 0} accent="black"  />
      </section>

      {/* ── Middle Row: groups + metrics ── */}
      <section className="grid xl:grid-cols-3 gap-6">

        {/* Gerência */}
        <GroupCard
          title="Gestão"
          subtitle="Distribuição entre lideranças"
          owners={management}
          average={avgManagement}
        />

        {/* Operação */}
        <GroupCard
          title="Operação"
          subtitle="Distribuição das demandas operacionais"
          owners={operation}
          average={avgOperation}
        />

        {/* Métricas rápidas */}
        <div className="flex flex-col gap-4">

          {/* Alerta */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
            <span className="text-2xl mt-0.5">🔴</span>
            <div>
              <p className="font-semibold text-red-700 text-sm">Atenção do Time</p>
              <p className="text-red-600 font-bold text-2xl mt-0.5">
                {summary.overdue ?? 0} <span className="text-sm font-normal">em atraso</span>
              </p>
              <p className="text-xs text-red-400 mt-1">
                Priorize as entregas críticas para retomar o ritmo.
              </p>
            </div>
          </div>

          <RankingCard></RankingCard>
          
          {/* Equilíbrio */}
          <MetricCard
            label="Índice de Equilíbrio"
            description="Quanto mais próximo de 100%, mais equilibrada está a carga."
            value={`${balanceScore}%`}
            valueClass={
              balanceScore >= 80
                ? "text-emerald-500"
                : balanceScore >= 50
                ? "text-amber-500"
                : "text-red-500"
            }
          >
            <ProgressBar value={Number(balanceScore)} />
          </MetricCard>

          {/* Score CRT */}
          <MetricCard
            label="Score Geral CRT"
            description="Percentual de tarefas entregues dentro do prazo."
            value={`${performanceScore}%`}
            valueClass={perfColor}
          >
            <ProgressBar
              value={Number(performanceScore)}
              color={performanceScore < 70 ? "bg-red-400" : "bg-emerald-400"}
            />
          </MetricCard>

            
        </div>
      </section>

    </div>
  );
}

/* ── Sub-components ── */

function KpiCard({ label, value, accent = "gray" }) {
  const colors = {
    gray:   "border-gray-200 bg-white",
    indigo: "border-indigo-200 bg-indigo-50",
    red:    "border-red-200 bg-red-50",
    green:  "border-green-200 bg-green-50",
    amber:  "border-amber-200 bg-amber-50",
    blueStrong: "border-blue-300 bg-blue-100",
    redStrong:  "border-red-400 bg-red-100",
    black: "border-gray-800 bg-gray-900"
  };

  const textColors = {
    gray:   "text-gray-800",
    indigo: "text-indigo-700",
    red:    "text-red-600",
    green:  "text-emerald-600",
    amber:  "text-amber-600",
    blueStrong: "text-blue-800",
    redStrong:  "text-red-700",
    black: "text-white"
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${colors[accent]}`}>
      <p className="text-xs font-medium text-gray-500 uppercase  mb-1">{label}</p>
      <p className={`text-3xl font-extrabold tabular-nums ${textColors[accent]}`}>{value}</p>
    </div>
  );
}

function GroupCard({ title, subtitle, owners, average }) {
  const sorted = [...owners].sort((a, b) => b.count - a.count);
  const medals = ["🥇", "🥈", "🥉"];
  const navigate = useNavigate();
  console.log(owners);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-h-120 overflow-y-auto">
      <div className="w-full sticky top-0 bg-white">
        <p className="font-bold text-gray-900 text-base">{title}</p>
        <p className="text-xs text-gray-400 mb-5">{subtitle}</p>
      </div>
      

      <div className="space-y-4">
        {sorted.map((owner, i) => {
          const ratio = average > 0 ? owner.count / average : 0;
          const palette =
            ratio > 1.3 ? PALETTE.red : ratio < 0.7 ? PALETTE.cyan : PALETTE.green;
          const barW = Math.min(ratio * 100, 100);

          return (
            <div
              key={owner.ownerUserID}
              onClick={() => navigate(`/pessoa/${encodeURIComponent(owner.ownerUserID)}`)}
              className="group cursor-pointer rounded-xl px-3 py-2 -mx-3 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/pessoa/${encodeURIComponent(owner.ownerUserID)}`)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {i < 3 && <span className="text-base">{medals[i]}</span>}
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {owner.ownerUserLogin}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 text-xs">
                    →
                  </span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${palette.badge}`}>
                  {owner.count}
                </span>
              </div>

              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${palette.bar}`}
                  style={{ width: `${barW}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400">
        <span>Média do grupo</span>
        <span className="font-semibold text-gray-600">{average.toFixed(1)}</span>
      </div>
    </div>
  );
}


function MetricCard({ label, description, value, valueClass, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-extrabold mt-1 ${valueClass}`}>{value}</p>
      {children}
      <p className="text-xs text-gray-400 mt-2">{description}</p>
    </div>
  );
}

function ProgressBar({ value, color = "bg-indigo-400" }) {
  return (
    <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-1.5 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}
