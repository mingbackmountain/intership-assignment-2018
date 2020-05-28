import { config } from "dotenv";
config();
import { migrateDatabase } from "./migrateDatabase";
import { createConnections } from "typeorm";
import { app } from "./app";

createConnections().then(() => {
  migrateDatabase();
  const port = process.env.PORT || 3000;

  app.listen(port, () => console.log(`Server is running at ${port}`));
});
