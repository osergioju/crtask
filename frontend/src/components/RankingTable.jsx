// frontend/src/components/risk/RankingTable.jsx

import { useEffect, useState } from "react";
import { getClientesRanking } from "../service/api";
import RiskBadge from "./RiskBadge";

export default function RankingTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClientesRanking()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-400">Carregando ranking...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3 text-right">Score</th>
            <th className="px-4 py-3 text-right">Atrasadas</th>
            <th className="px-4 py-3 text-right">Urgente</th>
            <th className="px-4 py-3 text-right">Retrab.</th>
            <th className="px-4 py-3 text-right">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((client) => (
            <tr
              key={client.clientID}
              className="border-b border-gray-50 hover:bg-gray-50"
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                {client.rank}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700">
                {client.name}
              </td>

              <td className="px-4 py-3 text-right font-semibold text-gray-800">
                {client.riskScore}
              </td>

              <td className="px-4 py-3 text-right text-red-600">
                {client.summary.overdue}
              </td>

              <td className="px-4 py-3 text-right text-orange-600">
                {client.summary.urgente}
              </td>

              <td className="px-4 py-3 text-right text-amber-600">
                {client.summary.retrabalho}
              </td>

              <td className="px-4 py-3 text-right">
                <RiskBadge level={client.riskLevel} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}