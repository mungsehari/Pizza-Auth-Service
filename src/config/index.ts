import { config } from "dotenv";

config();

const { PROT, NODE_ENV } = process.env;

export const Config = {
  PROT,
  NODE_ENV,
};
