import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
  const PORT = Config.PORT;
  try {
    await AppDataSource.initialize();
    logger.info("Database connection successful!");

    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
