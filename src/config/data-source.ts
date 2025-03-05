import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Config } from ".";
import { RefreshToken } from "../entity/RefreshToken";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST || "localhost",
  port: Number(Config.DB_PORT) || 5432,
  username: Config.DB_USERNAME || "postgres",
  password: Config.DB_PASSWORD || "hari0412",
  database: Config.DB_NAME || "mernstck_auth_service",
  //Don't use this in production. Always  kep false
  synchronize: true,
  logging: false,
  entities: [User, RefreshToken],
  migrations: [],
  subscribers: [],
});
