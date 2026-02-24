import { taskrowRequest } from "../services/taskrow.service.js";

/* ============================= */
/* Helpers                       */
/* ============================= */

function extractTagNames(tagsString) {
  if (!tagsString) return [];

  return tagsString.split(",").map((tag) => {
    const [name] = tag.split("|");
    return name.trim().toLowerCase();
  });
}

function calcularKpis(tasks) {
  const now = new Date();

  const summary = {
    total: tasks.length,
    inProgress: 0,
    concluded: 0,
    overdue: 0,
    intime: 0,
    backlog: 0,
    retrabalho: 0,
    urgente: 0,
    retrabalhoPercent: "0",
    urgentePercent: "0",
  };

  tasks.forEach((task) => {
    const isClosed = !!task.closed;
    const due = task.dueDate ? new Date(task.dueDate) : null;

    if (isClosed) {
      summary.concluded++;
    } else {
      summary.inProgress++;
      if (due && due < now) summary.overdue++;
      if (due && due > now) summary.intime++;
    }

    const tags = extractTagNames(task.tags);

    if (tags.includes("retrabalho")) summary.retrabalho++;
    if (tags.includes("urgente")) summary.urgente++;
    if (tags.includes("backlog")) summary.backlog++;
  });

  summary.retrabalhoPercent =
    summary.total > 0
      ? ((summary.retrabalho / summary.total) * 100).toFixed(0)
      : "0";

  summary.urgentePercent =
    summary.total > 0
      ? ((summary.urgente / summary.total) * 100).toFixed(0)
      : "0";

  return summary;
}

async function fetchAllOpenTasks() {
  let tasks = [];
  let offset = 0;
  let hasMore = true;
  let safety = 0;

  while (hasMore && safety < 50) {
    const response = await taskrowRequest({
      method: "POST",
      endpoint: "/api/v2/search/tasks/advancedsearch",
      body: {
        Offset: offset,
        Closed: false, // 🔥 MESMA BASE DA VISÃO GERAL
        Sort: "CreationDateDesc",
      },
    });

    const pageTasks =
      response?.data || response?.Data || response?.Items || [];

    tasks.push(...pageTasks);

    if (response?.NextOffset) {
      offset = response.NextOffset;
    } else {
      hasMore = false;
    }

    safety++;
  }

  return tasks;
}

/* ============================= */
/* Controller: Lista Clientes    */
/* ============================= */

export const getClientesResumo = async (req, res) => {
  try {
    const allTasks = await fetchAllOpenTasks();

    const tasksByClient = {};

    console.log(allTasks);

    allTasks.forEach((task) => {
      const clientId = Number(task.clientID || 0);
      const clientName =
        task.clientDisplayName || "Sem cliente";

      if (!tasksByClient[clientId]) {
        tasksByClient[clientId] = {
          clientID: clientId,
          name: clientName,
          tasks: [],
        };
      }

      tasksByClient[clientId].tasks.push(task);
    });


    const result = Object.values(tasksByClient)
      .map((client) => ({
        clientID: client.clientID,
        name: client.name,
        summary: calcularKpis(client.tasks),
      }))
      .sort((a, b) => b.summary.total - a.summary.total);

    res.json(result);

  } catch (err) {
    console.error("Erro /api/clientes:", err);
    res.status(500).json({
      error: "Erro ao gerar dados dos clientes",
    });
  }
};