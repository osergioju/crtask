import express from "express";
import * as slaController from "../controllers/sla.controller.js";

const router = express.Router();

router.get("/", slaController.getSlaOverview);
router.get("/operacional", slaController.getSlaOperacional);
router.get("/estrategico", slaController.getSlaEstrategico);

export default router;