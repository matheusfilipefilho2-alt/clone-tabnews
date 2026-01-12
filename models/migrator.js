import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

const defaultMigrationOptions = {
  // dryRun : faz um falso teste
  dryRun: true,
  // dir: escolhe o diretorio
  dir: resolve("infra", "migrations"), // dir = diretorio
  // direction: escolhe a função da migration
  direction: "up",
  verbose: true,
  // migrationsTable: tabela que armazena as migrations executadas
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    // migrationRunner: executa todas as migrations
    const migratedMigraions = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    return migratedMigraions;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
