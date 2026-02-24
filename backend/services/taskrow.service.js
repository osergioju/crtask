import { TASKROW_BASE_URL, TASKROW_API_KEY } from "../config/taskrow.config.js";

export async function taskrowRequest({
  method = "GET",
  endpoint,
  query = {},
  body = null,
}) {
  try {
    const url = new URL(`${TASKROW_BASE_URL}${endpoint}`);

    // adiciona query params se existirem
    Object.keys(query).forEach((key) => {
      if (query[key] !== undefined && query[key] !== null) {
        url.searchParams.append(key, query[key]);
      }
    });

    const headers = {
      "__identifier": TASKROW_API_KEY,
    };

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Erro Taskrow ${response.status}: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na integração Taskrow:", error.message);
    throw error;
  }
}