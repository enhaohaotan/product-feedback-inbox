import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { closePool } from "../db/db.server";

let container: StartedPostgreSqlContainer | null = null;

export async function setup() {
  process.env.NODE_ENV = "test";
  process.env.DB_SSL = "false";

  container = await new PostgreSqlContainer("postgres:16")
    .withDatabase("remixdb")
    .withUsername("test")
    .withPassword("test")
    .withExposedPorts(5432)
    .withCopyFilesToContainer([
      {
        source: "app/tests/sql/schema.sql",
        target: "/docker-entrypoint-initdb.d/11-init.sql",
      },
      {
        source: "app/tests/sql/startingData.sql",
        target: "/docker-entrypoint-initdb.d/12-startingData.sql",
      },
    ])
    .start();

  await new Promise((resolve) => setTimeout(resolve, 5000));

  process.env.DB_HOST = container.getHost();
  process.env.DB_PORT = container.getPort().toString();
  process.env.DB_USER = container.getUsername();
  process.env.DB_PASSWORD = container.getPassword();
  process.env.DB_NAME = container.getDatabase();
}

// Make the container cleanup happen only once at the end of all tests
export async function teardown() {
  await closePool();
  if (container) {
    await container.stop();
    container = null;
  }
}
