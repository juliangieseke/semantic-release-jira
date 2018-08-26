const verifyConditionsErrorMessage =
  "Environment variables JIRA_USER and JIRA_PASS must be set";

async function verifyConditions(_pluginConfig, context) {
  const {
    env: { JIRA_USER, JIRA_PASS }
  } = context;
  if (!JIRA_USER || !JIRA_PASS) {
    throw new Error(verifyConditionsErrorMessage);
  }
}

async function notify(pluginConfig, context) {
  context.logger(pluginConfig, context);
}

module.exports = { verifyConditionsErrorMessage, verifyConditions, notify };
