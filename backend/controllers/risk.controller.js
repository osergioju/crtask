import { generateClientRanking } from "../services/risk.service.js";

export const getClientRanking = async (req, res) => {
  try {
    const ranking = await generateClientRanking();
    res.json(ranking);
  } catch (error) {
    console.error("Erro ao gerar ranking:", error);
    res.status(500).json({
      error: "Erro ao gerar ranking de clientes",
    });
  }
};