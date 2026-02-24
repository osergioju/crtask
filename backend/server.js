import "dotenv/config"; // 👈 PRIMEIRA LINHA

import express from "express";
import cors from "cors";

import kpiRoutes from "./routes/kpi.routes.js";
import slaRoutes from "./routes/sla.routes.js";
import volumeRoutes from "./routes/volume.routes.js";
import retrabalhoRoutes from "./routes/retrabalho.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import pessoasRoutes from "./routes/pessoas.routes.js";
import rankingRoutes from "./routes/risk.routes.js";

const app = express();
 
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API DashCRT rodando 🚀" });
});

/* ROTAS PRINCIPAIS */
app.use("/api/kpis", kpiRoutes);
app.use("/api/sla", slaRoutes);
app.use("/api/volume", volumeRoutes);
app.use("/api/retrabalho", retrabalhoRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/pessoas", pessoasRoutes);
app.use("/api/risk", rankingRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});