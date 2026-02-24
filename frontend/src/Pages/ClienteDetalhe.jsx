import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClienteKpis } from "../service/api";

import ClienteHeader from "../components/cliente/ClienteHeader";
import ClienteResumoKpis from "../components/cliente/ClienteResumoKpis";
import ClienteTopPessoas from "../components/cliente/ClienteTopPessoas";
import ClienteSLA from "../components/cliente/ClienteSLA";
import ClienteStatusChart from "../components/cliente/ClienteStatusChart";

export default function ClienteDetalhe() {
  const { clientId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClienteKpis(clientId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [clientId]);
  console.log(data);
  if (loading) {
    return (
      <div className="p-8 text-gray-400 text-sm">
        Carregando cliente...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-red-500 text-sm">
        Erro ao carregar cliente.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">

      <ClienteHeader name={data.name} />

      <ClienteResumoKpis summary={data.summary} />

      <div className="grid md:grid-cols-2 gap-6">
        <ClienteTopPessoas pessoas={data.topPessoas || []} />
        <ClienteSLA slaHoras={data.slaMedioHoras || 0} />
      </div>

      <ClienteStatusChart byStatus={data.byStatus || []} />

    </div>
  );
}