// backend/src/controllers/pessoas.controller.js
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
        Closed: false, // 🔥 MESMO FILTRO DA VISÃO GERAL
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
/* Controller                    */
/* ============================= */

export const getPessoas = async (req, res) => {
  try {
    // 1️⃣ Buscar usuários
    const usersResponse = await taskrowRequest({
      method: "GET",
      endpoint: "/api/v1/User/ListUsers",
    });

    const users =
      usersResponse?.data ||
      usersResponse?.Data ||
      (Array.isArray(usersResponse) ? usersResponse : []);

    if (!Array.isArray(users)) {
      return res.json([]);
    }

    // 2️⃣ Buscar tarefas abertas (mesmo dataset da Visão Geral)
    const allTasks = await fetchAllOpenTasks();

    // 3️⃣ Agrupar tarefas por owner
    const tasksByOwner = {};

    allTasks.forEach((task) => {
      const ownerId = Number(task.ownerUserID || 0);

      if (!tasksByOwner[ownerId]) {
        tasksByOwner[ownerId] = [];
      }

      tasksByOwner[ownerId].push(task);
    });

    // 4️⃣ Montar resultado final
    const result = users
      .filter((user) => !user.Inactive) // mantém apenas ativos
      .map((user) => {
        const userId = Number(user.UserID);
        const userName =
          user.FullName || user.UserLogin || "—";

        const userLogin = user.UserLogin || userName;

        const userTasks = tasksByOwner[userId] || [];

        return {
          ownerUserID: userId,
          ownerUserLogin: userLogin,
          name: userName,
          summary: calcularKpis(userTasks),
        };
      })
      .sort((a, b) => b.summary.total - a.summary.total);

    res.json(result);

  } catch (err) {
    console.error("Erro /api/pessoas:", err);
    res.status(500).json({
      error: "Erro ao gerar dados dos colaboradores",
    });
  }
};