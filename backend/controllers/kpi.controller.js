import { taskrowRequest } from "../services/taskrow.service.js";

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


function extractTagNames(tagsString) {
  if (!tagsString) return [];

  return tagsString.split(",").map(tag => {
    const [name] = tag.split("|");
    return name.trim().toLowerCase();
  });
}

export const getKpis = async (req, res) => {
  try {
    const { from, to, clientID, ownerID } = req.query;

    let tasks = [];
    let offset = 0;
    let hasMore = true;
    let safety = 0;

    // ===== BUSCA PAGINADA =====
    while (hasMore && safety < 50) {
      const response = await taskrowRequest({
        method: "POST",
        endpoint: "/api/v2/search/tasks/advancedsearch",
        body: {
          Offset: offset,
          Closed: false, // somente abertas
          Sort: "CreationDateDesc"
        }
      });

      const pageTasks =
        response?.data ||
        response?.Data ||
        response?.Items ||
        [];

      tasks.push(...pageTasks);

      if (response?.NextOffset) {
        offset = response.NextOffset;
      } else {
        hasMore = false;
      }

      safety++;
    }

    const now = new Date();

    // ===== SUMMARY =====
    const summary = {
      total: tasks.length,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      intime: 0,
      backlog: 0,
      retrabalho: 0,
      urgente: 0
    };

    const byStatus = {};
    const byOwner = {};

    // ===== PROCESSAMENTO =====
    tasks.forEach(task => {
      const {
        closed,
        dueDate,
        tags,
        pipelineStep,
        ownerUserID,
        ownerUserLogin
      } = task;

      const isClosed = !!closed;
      const due = dueDate ? new Date(dueDate) : null;
      const isOverdue = !isClosed && due && due < now;
      const isInTime = !isClosed && due && due > now;

      // ---- SUMMARY ----
      if (isClosed) {
        summary.completed++;
      } else {
        summary.inProgress++;
        if (isOverdue) summary.overdue++;
        if (isInTime) summary.intime++;
      }

      const tagList = extractTagNames(tags);

      if (tagList.includes("backlog")) {
        summary.backlog++;
      }

      if (tagList.includes("retrabalho")) {
        summary.retrabalho++;
      }

      if (tagList.includes("urgente")) {
        summary.urgente++;
      }

      // ---- STATUS ----
      const status = pipelineStep || "Outros";
      byStatus[status] = (byStatus[status] || 0) + 1;

      // ---- OWNER ----
      const ownerId = ownerUserID || 0;
      const ownerLogin = ownerUserLogin || "Sem responsável";

      if (!byOwner[ownerId]) {
        byOwner[ownerId] = {
          ownerUserID: ownerId,
          ownerUserLogin: ownerLogin,
          count: 0
        };
      }

      byOwner[ownerId].count++;
    });

    // ===== TRANSFORMAÇÕES FINAIS =====
    const ownerArray = Object.values(byOwner).sort(
      (a, b) => b.count - a.count
    );

    const statusArray = Object.entries(byStatus).map(
      ([status, count]) => ({
        status,
        count
      })
    );  

    summary.retrabalhoPercent =
    summary.total > 0
      ? ((summary.retrabalho / summary.total) * 100).toFixed(0)
      : 0;

  summary.urgentePercent =
    summary.total > 0
      ? ((summary.urgente / summary.total) * 100).toFixed(0)
      : 0;

    res.json({
      period: { from, to },
      summary,
      byStatus: statusArray,
      byOwner: ownerArray
    });

  } catch (error) {
    console.error("Erro ao buscar KPIs:", error);
    res.status(500).json({ error: "Erro ao gerar KPIs" });
  }
};


export const getPessoaKpis = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const ownerIdNum = Number(ownerId);

    let tasks = [];
    let offset = 0;
    let hasMore = true;
    let safety = 0;

    // 🔎 1️⃣ Buscar TODAS as tarefas
   while (hasMore && safety < 50) {
    const response = await taskrowRequest({
      method: "POST",
      endpoint: "/api/v2/search/tasks/advancedsearch",
      body: {
        Offset: offset,
        Closed: false, 
        Sort: "DueDateAsc"
      }
    });

      const pageTasks =
        response?.data ||
        response?.Data ||
        response?.Items ||
        [];

      tasks.push(...pageTasks);

      if (response?.NextOffset) {
        offset = response.NextOffset;
      } else {
        hasMore = false;
      }

      safety++;
    }

    // 🔥 2️⃣ Filtrar pelo ownerUserID
    const filteredTasks = tasks.filter(
      (task) => Number(task.ownerUserID) === ownerIdNum
    );

    const now = new Date();

    // 🔎 3️⃣ Gerar KPIs apenas da pessoa
    const summary = {
      total: filteredTasks.length,
      inProgress: 0,
      overdue: 0,
      intime: 0,
      backlog: 0,
      retrabalho: 0,
      urgente: 0
    };
    
    filteredTasks.forEach((task) => {
      const isClosed = !!task.closed;
      const due = task.dueDate ? new Date(task.dueDate) : null;

      if (!isClosed) {
        summary.inProgress++;
        if (due && due < now) summary.overdue++;
        if (due && due > now) summary.intime++;
      }

      const tags = extractTagNames(task.tags);

      if (tags.includes("retrabalho")) {
        summary.retrabalho++;
      }

      if (tags.includes("urgente")) {
        summary.urgente++;
      }

      if (tags.includes("backlog")) {
        summary.backlog++;
      }
    });

    summary.retrabalhoPercent =
      summary.total > 0
        ? ((summary.retrabalho / summary.total) * 100).toFixed(0)
        : 0;

    summary.urgentePercent =
      summary.total > 0
        ? ((summary.urgente / summary.total) * 100).toFixed(0)
        : 0;
        
    res.json({
      ownerUserID: ownerIdNum,
      ownerUserLogin:
        filteredTasks[0]?.ownerUserLogin || "Sem responsável",
      summary,
      tasks: filteredTasks
    });

  } catch (err) {
    console.error("Erro pessoa:", err);
    res.status(500).json({ error: "Erro ao gerar dados da pessoa" });
  }
};


export const getClienteKpis = async (req, res) => {
  try {
    const { clientId } = req.params;
    const clientIdNum = Number(clientId);

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
        response?.data ||
        response?.Data ||
        response?.Items ||
        [];

      tasks.push(...pageTasks);

      if (response?.NextOffset) {
        offset = response.NextOffset;
      } else {
        hasMore = false;
      }

      safety++;
    }

    const filteredTasks = tasks.filter(
      (task) => Number(task.clientID) === clientIdNum
    );

    const summary = calcularKpis(filteredTasks);

    res.json({
      clientID: clientIdNum,
      name: filteredTasks[0]?.clientDisplayName || "Cliente",
      summary,
      tasks: filteredTasks,
    });

  } catch (err) {
    console.error("Erro KPI cliente:", err);
    res.status(500).json({
      error: "Erro ao gerar KPIs do cliente",
    });
  }
};