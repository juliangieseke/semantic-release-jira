const parseCommitBody = require("./functions/parseCommitBody.js");
const getAuthHeader = require("./functions/getAuthHeader.js");
const jiraApiCall = require("./functions/jiraApiCall.js");

/**
 * success plugin method which updates JIRA Issues
 *
 * @async
 * @param {object} pluginConfig config passed in by semantic-release
 * @param {object} context plugin context passed in by semantic-release
 */
async function success(pluginConfig, context) {
  const {
    commits,
    nextRelease: { version },
    env,
    logger,
  } = context;
  const { auth, actions } = pluginConfig;

  const authHeader = getAuthHeader({ auth, env, logger });
  if (!authHeader) {
    return;
  }

  if (!actions.length) {
    logger.error("no actions defined for matched JIRAs");
    return;
  }

  const results = Promise.all(
    commits
      .reduce((issueKeys, commit) => {
        const { body } = commit;
        return issueKeys.concat(parseCommitBody(body));
      }, [])
      .reduce((results, issueKey) => {
        return results.concat(
          actions.map(
            async (action) =>
              await jiraApiCall({
                issueKey,
                version,
                authHeader,
                action,
                logger,
              })
          )
        );
      }, [])
  );

  return results;
}

module.exports = success;
