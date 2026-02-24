// frontend/src/service/api.js

const API_BASE_URL = "http://localhost:3001/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro API ${response.status}: ${errorText}`);
  }

  return response.json();
}

/* ============================= */
/* 🔹 KPIs Gerais                */
/* ============================= */

export function getKpis(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/kpis${query ? `?${query}` : ""}`);
}

/* ============================= */
/* 🔹 Lista de tarefas           */
/* ============================= */

export function getTasks(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/tasks${query ? `?${query}` : ""}`);
}

/* ============================= */
/* 🔹 KPIs por pessoa            */
/* ============================= */

export function getPessoaKpis(ownerId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(
    `/kpis/pessoa/${ownerId}${query ? `?${query}` : ""}`
  );
}

/* ============================= */
/* 🔹 Lista de colaboradores     */
/* ============================= */

export function getPessoas(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/pessoas${query ? `?${query}` : ""}`);
}

/* ============================= */
/* 🔥 NOVO: Lista de clientes    */
/* ============================= */

export function getClientes(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/clientes${query ? `?${query}` : ""}`);
}


/* ============================= */
/* 🔥 NOVO: KPIs por cliente     */
/* ============================= */
export function getClienteKpis(clientId, params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(
    `/kpis/cliente/${clientId}${query ? `?${query}` : ""}`
  );
}

// riscos
export function getClientesRanking(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/risk/clientes/ranking${query ? `?${query}` : ""}`);
}