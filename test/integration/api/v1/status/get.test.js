import orchestrator from "test/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForallServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonimous user", () => {
    test("Retriving current system status", async () => {
      const response = await fetch("http://127.0.0.1:3000/api/v1/status");

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

      expect(responseBody.dependencies.database.version).toEqual("16.0");
      expect(responseBody.dependencies.database.max_connections).toEqual(100);
      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
    });
  });
});
