import database from "infra/database.js";
import webserver from "infra/webserver.js";
import email from "infra/email.js";
import { NotFoundError } from "infra/errors.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 minutes

async function findOneValidById(tokenId) {
  const activationTokenObject = await runSelectQuery(tokenId);

  return activationTokenObject;

  async function runSelectQuery(tokenId) {
    const results = await database.query({
      text: `
       SELECT
         *
       FROM
         user_activations_tokens
       WHERE
         id = $1
         AND expires_at > NOW() 
         AND used_at IS NULL 
       LIMIT
         1
     ;`,
      values: [tokenId],
    });

    if (results.rowsCount === 0) {
      throw new NotFoundError({
        message:
          "O token de ativação utilazando não foi encontrado no sistema ou expirou.",
        action: "faça um novo cadastro.",      
      })
    }

    return results.rows[0];
  }
}

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const results = await database.query({
      text: `
    INSERT INTO
      user_activations_tokens (user_id, expires_at)
    VALUES
      ($1, $2)
    RETURNING
      *
   ;`,
      values: [userId, expiresAt],
    });

    return results.rows[0];
  }
}

async function SendEmailToUser(user, activationToken) {
  await email.send({
    from: "TabNews <contato@tabnews.com.br>",
    to: user.email,
    subject: "Ative seu cadastro no TabNews",
    text: `${user.username} clique no link abaixo para ativar seu cadastro no TabNews
        
        ${webserver.origin}/cadastro/ativar/${activationToken.id}

        Atenciosamente
        Equipe TabNews`,
  });
}
const activation = {
  create,
  findOneValidById,
  SendEmailToUser,
};

export default activation;
