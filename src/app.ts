import "reflect-metadata";
import express, { Application, NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import logger from "./config/logger";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import tenantRouter from "./routes/tenant";

const app = express();
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("Welcome to the API");
});
app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);
app.post("/auth/register", async (req, res) => {
  res.status(201).json();
});
// global error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        path: "",
        location: "",
      },
    ],
  });
});

export default app;
