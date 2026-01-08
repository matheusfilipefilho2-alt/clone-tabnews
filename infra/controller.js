import { internalServerError, MethodNotAllowedError } from "infra/errors";

function onNoMatchHandler(request, response) {
  const publcErrorObject = new MethodNotAllowedError();
  response.status(publcErrorObject.statusCode).json(publcErrorObject);
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new internalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.log("\n Erro dentro do catch do next-connect:");
  console.error(publicErrorObject);

  response.status(500).json(publicErrorObject);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
