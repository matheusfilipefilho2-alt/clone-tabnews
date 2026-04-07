import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successful)", () => {
  test("create user account", async () => {
    const createUSerResponse = await fetch(
      "http://localhost:3000/api/v1/users",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: "RegistrationFlow",
          email: "registration.flow@curso.dev",
          password: "RegistrationFlowPassword",
        }),
      }
    );

    expect(createUSerResponse.status).toBe(201);

    const createUSerResponseBody = await createUSerResponse.json();

    expect(createUSerResponseBody).toEqual({
      id: createUSerResponseBody.id,
      username: "RegistrationFlow",
      email: "registration.flow@curso.dev",
      password: createUSerResponseBody.password,
      features: ["read:activation_token"],
      created_at: createUSerResponseBody.created_at,
      updated_at: createUSerResponseBody.updated_at,
    });
  });

  test("Receive activation email", async () => {

  });

  test("Activate account", async () => {

  });

  test("Login", async () => {

  });

  test("Get user information", async () => {
    
  });
});
