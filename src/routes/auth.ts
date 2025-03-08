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
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types";
import vaildateRefreshToken from "../middlewares/vaildateRefreshToken";
import parseRefreshToken from "../middlewares/parseRefreshToken";

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

authRouter.get("/self", authenticate, (req: Request, res: Response) => {
  authController.self(req as AuthRequest, res);
});

authRouter.post(
  "/refresh",
  vaildateRefreshToken,
  (req: Request, res: Response, next: NextFunction) => {
    authController.refresh(req as AuthRequest, res, next);
  },
);

authRouter.post(
  "/logout",
  authenticate,
  parseRefreshToken,
  (req: Request, res: Response, next: NextFunction) => {
    authController.logout(req as AuthRequest, res, next);
  },
);

export default authRouter;
