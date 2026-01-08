import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(gethandler);
router.post(posthandler);

export default router.handler(controller.errorHandlers);

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

async function gethandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function posthandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    // migrationRunner: executa todas as migrations
    const migratedMigraions = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    await dbClient.end();

    if (migratedMigraions.length > 0) {
      return response.status(201).json(migratedMigraions);
    }

    return response.status(200).json(migratedMigraions);
  } finally {
    await dbClient.end();
  }
}
