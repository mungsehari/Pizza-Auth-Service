import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST || "localhost",
  port: Number(Config.DB_PORT) || 5432,
  username: Config.DB_USERNAME || "postgres",
  password: Config.DB_PASSWORD || "hari0412",
  database: Config.DB_NAME || "mernstck_auth_service",
  //Don't use this in production. Always  kep false
  synchronize: false,
  logging: false,
  entities: ["src/entity/*.{ts,js}"],
  migrations: ["src/migration/*.{ts,js}"],
  subscribers: [],
});
