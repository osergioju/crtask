import express from "express";
import { getClientRanking } from "../controllers/risk.controller.js";

const router = express.Router();

router.get("/clientes/ranking", getClientRanking);

export default router;