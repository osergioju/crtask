import express from "express";
import * as volumeController from "../controllers/volume.controller.js";

const router = express.Router();

router.get("/clientes", volumeController.getVolumePorCliente);
router.get("/colaboradores", volumeController.getVolumePorColaborador);

export default router;