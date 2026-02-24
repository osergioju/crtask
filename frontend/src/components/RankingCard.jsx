// frontend/src/components/risk/RankingCard.jsx

import { useEffect, useState } from "react";
import { getClientesRanking } from "../service/api"
import RiskBadge from "./RiskBadge";
import { useNavigate } from "react-router-dom";

export default function RankingCard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getClientesRanking()
      .then((res) => {
        setData(res.slice(0, 5)); // 🔥 Top 5
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Ranking de Risco
        </h3>
        <button
          onClick={() => navigate("/clientes")}
          className="text-xs text-indigo-500 hover:text-indigo-700"
        >
          Ver todos →
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-gray-400">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {data.map((client) => (
            <div
              key={client.clientID}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {client.rank}. {client.name}
                </p>
                <p className="text-xs text-gray-400">
                  Score: {client.riskScore}
                </p>
              </div>

              <RiskBadge level={client.riskLevel} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}