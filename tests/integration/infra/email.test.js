import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "FinTab <matheus@gmail.com>",
      to: "contato@matheus.com",
      subject: "Teste de assunto",
      text: "Teste de corpo.",
    });

    await email.send({
      from: "FinTab <matheus@gmail.com>",
      to: "contato@matheus.com",
      subject: "Ultimo email enviado",
      text: "corpo do ultimo email",
    });

    const lastEmail = await orchestrator.getLastEmail();
    expect(lastEmail.sender).toBe("<matheus@gmail.com>");
    expect(lastEmail.recipients[0]).toBe("<contato@matheus.com>");
    expect(lastEmail.subject).toBe("Ultimo email enviado");
    expect(lastEmail.text).toBe("corpo do ultimo email\n");
  });
});
