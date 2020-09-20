const { template } = require("lodash");
const fetch = require("node-fetch");

const jiraApiCall = async ({
  issueKey,
  version,
  authHeader,
  action,
  logger,
}) => {
  const { url, method, body } = action;
  const project = issueKey.split("-")[0];
  const parsedUrl = template(url)({ issueKey });
  const parsedBody = template(body)({ version, project });

  logger.debug(
    `[${issueKey}] Starting action "${parsedUrl}" with body "${parsedBody}".`
  );

  const response = await fetch(parsedUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: parsedBody,
  }).catch((e) => {
    return e;
  });

  if (!response.ok) {
    logger.debug(response);
    logger.error(`[${issueKey}] Action "${parsedUrl}" failed.`);
    return response;
  }

  const json = await response.json().catch((e) => {
    return e.toString();
  });
  logger.debug(json);
  logger.success(`[${issueKey}] Action "${parsedUrl}" done.`);
  return json;
};

module.exports = jiraApiCall;
