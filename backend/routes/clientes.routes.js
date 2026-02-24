import express from "express";
import * as clientesController from "../controllers/clientes.controller.js";

const router = express.Router();

router.get("/", clientesController.getClientesResumo);

export default router;