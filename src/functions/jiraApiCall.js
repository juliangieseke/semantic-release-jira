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

  logger.info(
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
    logger.error(e);
  });

  if (!response || response.status >= 400) {
    logger.error(response);
    logger.error(
      `[${issueKey}] Action "${parsedUrl}" with body "${parsedBody}" failed. Check errors above.`
    );
    return false;
  }

  logger.success(
    `[${issueKey}] Action "${parsedUrl}" with body "${parsedBody}" done.`
  );
  return true;
};

module.exports = { jiraApiCall };
