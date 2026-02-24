import { create } from "zustand";

export const useFilters = create((set) => ({
  period: "month",
  client: null,
  clients: [],

  setPeriod: (period) => set({ period }),
  setClient: (client) => set({ client }),
  setClients: (clients) => set({ clients }),
}));