import { Config } from "./config";
import app from "./config/app";

const startServer = () => {
  const PORT = Config.PROT;
  try {
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
