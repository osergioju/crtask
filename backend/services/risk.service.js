import { taskrowRequest } from "./taskrow.service.js";

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

  return summary;
}

/* ============================= */
/* Risk Score                    */
/* ============================= */

function calculateRiskScore(summary) {
  return (
    summary.overdue * 3 +
    summary.urgente * 2 +
    summary.retrabalho * 2 +
    summary.backlog * 1
  );
}

function classifyRisk(score) {
  if (score >= 40) return "critico";
  if (score >= 20) return "atencao";
  return "saudavel";
}

/* ============================= */
/* Fetch Tasks                   */
/* ============================= */

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
        Closed: false,
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
/* Public Service                */
/* ============================= */

export async function generateClientRanking() {
  const allTasks = await fetchAllOpenTasks();

  const tasksByClient = {};

  allTasks.forEach((task) => {
    const clientId = Number(task.clientID || 0);
    const clientName = task.clientDisplayName || "Sem cliente";

    if (!tasksByClient[clientId]) {
      tasksByClient[clientId] = {
        clientID: clientId,
        name: clientName,
        tasks: [],
      };
    }

    tasksByClient[clientId].tasks.push(task);
  });

  const ranking = Object.values(tasksByClient).map((client) => {
    const summary = calcularKpis(client.tasks);
    const riskScore = calculateRiskScore(summary);
    const riskLevel = classifyRisk(riskScore);

    return {
      clientID: client.clientID,
      name: client.name,
      summary,
      riskScore,
      riskLevel,
    };
  });

  ranking.sort((a, b) => b.riskScore - a.riskScore);

  return ranking.map((item, index) => ({
    rank: index + 1,
    ...item,
  }));
}