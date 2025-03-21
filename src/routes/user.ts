import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { canAccess } from "../middlewares/canAccess";
import authenticate from "../middlewares/authenticate";
import { Roles } from "../constants";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    userController.create(req, res, next),
);

export default router;
