import express from "express";
import * as kpiController from "../controllers/kpi.controller.js";

const router = express.Router();

router.get("/", kpiController.getKpis);
router.get("/pessoa/:ownerId", kpiController.getPessoaKpis);
router.get("/cliente/:clientId", kpiController.getClienteKpis); 

export default router;