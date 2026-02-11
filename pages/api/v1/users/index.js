import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import user from "models/user.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  let userInputValues = request.body;
  if (typeof userInputValues === "string") {
    userInputValues = JSON.parse(userInputValues);
  }
  console.log(userInputValues);
  const newUser = await user.create(userInputValues);
  return response.status(201).json(newUser);
}
