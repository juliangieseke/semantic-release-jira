const verifyConditionsErrorMessage =
  "Environment variables JIRA_USER and JIRA_PASS must be set and not empty";

async function verifyConditions(_pluginConfig, context) {
  const {
    env: { JIRA_USER, JIRA_PASS }
  } = context;

  if (!JIRA_USER || !JIRA_PASS) {
    throw new Error(verifyConditionsErrorMessage);
  }
}

async function success(pluginConfig, context) {
  const { logger } = context;

  logger.success(pluginConfig, context);
}

module.exports = { verifyConditionsErrorMessage, verifyConditions, success };
