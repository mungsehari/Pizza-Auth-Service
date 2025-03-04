import { JwtPayload } from "./../../node_modules/@types/jsonwebtoken/index.d";
import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { TokenService } from "../services/TokenService";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
  ) {}
  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;
    this.logger.info(`new  request to register user:`, {
      firstName,
      lastName,
      email,
      password: "*****",
    });

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });
      this.logger.info(`User created with id:`, { id: user.id });

      // let privateKey: Buffer;

      // try {
      //   privateKey = fs.readFileSync(
      //     path.join(__dirname, "../../certs/private.pem"),
      //   );
      // } catch (error) {
      //   const err = createHttpError(
      //     500,
      //     "Failed to read private key from file",
      //   );
      //   next(err);
      //   return;
      // }

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      // const accessToken = sign(payload, privateKey, {
      //   algorithm: "RS256",
      //   expiresIn: "1h",
      //   issuer: "auth-service",
      // });
      const accessToken = this.tokenService.generateAccessToken(payload);

      // Persist the refresh tokens
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: String(newRefreshToken.id),
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
      });

      res.status(201).json({ id: user.id });
    } catch (error) {
      next(error);
      return;
    }
  }
}
