/**
 * verifyConditions plugin method which checks passed in arguments
 *
 * @param {object} pluginConfig config passed in by semantic-release
 * @param {object} context plugin context passed in by semantic-release
 * @async
 * @throws error messages for invalid or missing arguments
 */
async function verifyConditions(_pluginConfig, context) {
  const {
    env: { JIRA_USER, JIRA_PASS }
  } = context;

  if (!JIRA_USER || !JIRA_PASS) {
    throw new Error(
      "Environment variables JIRA_USER and JIRA_PASS must be set and not empty"
    );
  }

  return true;
}

module.exports = { verifyConditions };
