import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPessoaKpis } from "../service/api";

export default function PessoaDetalhe() {
  const { ownerId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getPessoaKpis(ownerId).then(setData);
  }, [ownerId]);

  if (!data) return <div className="p-8">Carregando...</div>;
  console.log(data.tasks);
  const { summary, ownerUserLogin } = data;
  console.log(data);
  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        {ownerUserLogin}
      </h1>

      <div className="grid grid-cols-6  gap-4">
        <Card label="Total" value={summary.total} />
        <Card label="Em andamento" value={summary.inProgress} />
        <Card label="Atrasadas" value={summary.overdue} />
        <Card label="Backlog" value={summary.backlog} />
        <Card label="Retrabalho" value={summary.retrabalho ?? 0} accent="red" />
        <Card label="Urgentes" value={summary.urgente ?? 0} accent="amber" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
            Demandas
        </h2>

        {data.tasks.length === 0 && (
            <p className="text-sm text-gray-400">
            Nenhuma demanda encontrada.
            </p>
        )}

        <div className="space-y-3">
            {data.tasks.map((task) => {
            const isOverdue =
                !task.closed &&
                task.dueDate &&
                new Date(task.dueDate) < new Date();
            return (
                <div
                onClick={() => window.open('https://crtcomunicacao.taskrow.com/#home/tasks/'+ task.clientNickName +'/'+ task.jobNumber +'/' + task.taskNumber, '_blank')}
                key={task.taskID}
                className={`border rounded-xl p-4 transition hover:shadow-sm cursor-pointer ${
                    isOverdue
                    ? "border-red-200 bg-red-50"
                    : "border-gray-100 bg-white"
                }`}
                >
                <div className="flex justify-between items-start">
                    <div>
                    <p className="font-semibold text-gray-800 text-sm">
                        <span className="bg-black rounded-lg text-white px-2 text-xs py-1 inline-block">{task.clientDisplayName}</span> - {task.taskTitle || task.subject || "Sem título"}
                    </p>

                    <p className="text-xs text-black mt-2">
                        Status: {task.pipelineStep || "Outros"}
                    </p>
                    </div>

                    <div className="text-right">
                    {task.dueDate && (
                        <p
                        className={`text-xs font-medium ${
                            isOverdue
                            ? "text-red-600"
                            : "text-gray-400"
                        }`}
                        >
                        Prazo:{" "}
                        {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                        </p>
                    )}

                    {task.closed && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Concluída
                        </span>
                    )}
                    </div>
                </div>
                </div>
            );
            })}
        </div>
        </div>
    </div>

    
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-xs text-gray-400 uppercase">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}