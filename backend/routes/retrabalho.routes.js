import express from "express";
import * as retrabalhoController from "../controllers/retrabalho.controller.js";

const router = express.Router();

router.get("/", retrabalhoController.getRetrabalhoGeral);
router.get("/clientes", retrabalhoController.getRetrabalhoPorCliente);

export default router;