import express from "express";
import { AuthController } from "../controllers/AuthController";

const authRouter = express.Router();
const authController = new AuthController();
authRouter.get("/register", (req, res) => authController.register(req, res));

export default authRouter;
