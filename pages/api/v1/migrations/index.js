import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    // dryRun : faz um falso teste
    dryRun: true,
    // dir: escolhe o diretorio
    dir: join("infra", "migrations"), // dir = diretorio
    // direction: escolhe a função da migration
    direction: "up",
    verbose: true,
    // migrationsTable: tabela que armazena as migrations executadas
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    // migrationRunner: executa todas as migrations
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    // migrationRunner: executa todas as migrations
    const migratedMigraions = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await dbClient.end();

    if (migratedMigraions.length > 0) {
      return response.status(201).json(migratedMigraions);
    }

    return response.status(200).json(migratedMigraions);
  }
  return response.status(405).end();
}
