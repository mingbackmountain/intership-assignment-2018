import { getConnection } from "typeorm";
import { readdirSync, readFileSync } from "fs";

export function migrateDatabase() {
  const sqlFiles = readdirSync("migrations");
  const sqlCommands = sqlFiles.map(file => {
    const sqlCommand = readFileSync("migrations" + "/" + file, "utf8");
    return sqlCommand;
  });

  sqlCommands.forEach(command => {
    getConnection().query(command);
  });
}
