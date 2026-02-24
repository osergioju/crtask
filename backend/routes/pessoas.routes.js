// backend/src/routes/pessoas.routes.js
import express from "express";
import * as pessoasController from "../controllers/pessoas.controller.js";

const router = express.Router();

router.get("/", pessoasController.getPessoas);

export default router;