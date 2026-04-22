import orchestrator from "tests/orchestrator.js";
import activation from "models/activation.js";
import webserver from "infra/webserver";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case: Registration Flow (all successful)", () => {
  let createUSerResponseBody;
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

    createUSerResponseBody = await createUSerResponse.json();

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
    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@tabnews.com.br>");
    expect(lastEmail.recipients[0]).toBe("<registration.flow@curso.dev>");
    expect(lastEmail.subject).toBe("Ative seu cadastro no TabNews");
    expect(lastEmail.text).toContain("RegistrationFlow");

    const activationTokenId = orchestrator.extractUUID(lastEmail.text)

    expect(lastEmail.text).toContain(
      `${webserver.origin}/cadastro/ativar/${activationTokenId}`,
    )

    const activationTokenObject = await activation.findOneValidById(activationTokenId);

    expect(activationTokenObject.user_id).toBe(createUSerResponseBody.id);
    expect(activationTokenObject.used_at).toBe(null);
  });

  test("Activate account", async () => {});

  test("Login", async () => {});

  test("Get user information", async () => {});
});
