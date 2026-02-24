// components/cliente/ClienteStatusChart.jsx

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ClienteStatusChart({ byStatus }) {
  if (!byStatus.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-gray-400">
          Sem dados de status.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
        Distribuição por Status
      </h3>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={byStatus}
              dataKey="count"
              nameKey="status"
              outerRadius={90}
              label
            >
              {byStatus.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}