import { JwtPayload } from "./../../node_modules/@types/jsonwebtoken/index.d";
import { NextFunction, Response } from "express";
import { AuthRequest, RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { TokenService } from "../services/TokenService";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CredentialService } from "../services/CredentialService";
import { Roles } from "../constants";

export class AuthController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private tokenService: TokenService,
    private credentialService: CredentialService,
  ) {}
  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
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
        role: Roles.CUSTOMER,
      });
      this.logger.info(`User created with id:`, { id: user.id });

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };
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

  async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { email, password } = req.body;
    this.logger.info(`new  request to login user:`, {
      email,
      password: "*****",
    });

    try {
      const user = await this.userService.findByEmailWithPassword(email);

      if (!user) {
        const error = createHttpError(400, "Email or password does not match");
        next(error);
        return;
      }

      const passwordMatch = await this.credentialService.comparePassword(
        password,
        user.password,
      );

      if (!passwordMatch) {
        const error = createHttpError(400, "Email or password does not match");
        next(error);
        return;
      }
      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };
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

      this.logger.info(`User logged in with id:`, { id: user.id });
      res.json({ id: user.id });
    } catch (error) {
      next(error);
      return;
    }
  }
  async self(req: AuthRequest, res: Response) {
    // token req.auth.id
    const user = await this.userService.findById(Number(req.auth.sub));
    res.json({ ...user, password: undefined });
  }
  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payload: JwtPayload = {
        sub: req.auth.sub,
        role: req.auth.role,
      };
      const accessToken = this.tokenService.generateAccessToken(payload);

      const user = await this.userService.findById(Number(req.auth.sub));
      if (!user) {
        const error = createHttpError(
          400,
          "User with the token could not find",
        );
        next(error);
        return;
      }
      //Delete old refresh token
      await this.tokenService.deleteRefreshToken(Number(req.auth.id));
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

      this.logger.info(`User logged in with id:`, { id: user.id });
      res.json({ id: user.id });
    } catch (error) {
      next(error);
      return;
    }
  }
  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await this.tokenService.deleteRefreshToken(Number(req.auth.id));
      this.logger.info(`User logged out with id: ${req && req.auth.id}`, {
        id: req.auth.id,
      });
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({});
    } catch (error) {
      next(error);
      return;
    }
  }
}
