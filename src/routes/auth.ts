import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import registerValidator from "../validators/register-validator";
import loginValidator from "../validators/login-validator";
import { CredentialService } from "../services/CredentialService";

const authRouter = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
const authController = new AuthController(
  userService,
  logger,
  tokenService,
  credentialService,
);

authRouter.post("/register", registerValidator, (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await authController.register(req, res, next);
}) as RequestHandler);

authRouter.post("/login", loginValidator, (async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await authController.login(req, res, next);
}) as RequestHandler);

export default authRouter;
