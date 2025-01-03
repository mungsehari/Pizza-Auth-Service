import app from "./app";
import { Config } from "./config";
import logger from "./config/logger";

const startServer = () => {
  const PORT = Config.PROT;
  try {
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
