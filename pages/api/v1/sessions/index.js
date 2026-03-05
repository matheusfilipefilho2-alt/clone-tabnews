import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import authentication from "models/authentication.js";
import session from "models/session.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  let userInputValues = request.body;
  if (typeof userInputValues === "string") {
    userInputValues = JSON.parse(userInputValues);
  }
  const AutenticatedUser = await authentication.getAutenticatedUser(
    userInputValues.email,
    userInputValues.password
  );

  const newSession = await session.create(AutenticatedUser.id);

  controller.setSessionCookie(newSession.token, response);

  return response.status(201).json(newSession);
}
