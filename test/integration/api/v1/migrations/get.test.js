import orchestrator from "test/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForallServices();
  await orchestrator.clearDatabase();
});
describe("GET /api/v1/migrations", () => {
  describe("Anonimous user", () => {
    test("Running pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
