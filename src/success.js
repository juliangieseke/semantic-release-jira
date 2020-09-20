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

  const issueKeys = commits.reduce((issueKeys, commit) => {
    const { body } = commit;
    return issueKeys.concat(parseCommitBody(body));
  }, []);

  const results = issueKeys.map((issueKey) =>
    actions.reduce(
      (p, action) =>
        p.then(() =>
          jiraApiCall({
            issueKey,
            version,
            authHeader,
            action,
            logger,
          })
        ),
      Promise.resolve()
    )
  );
  return Promise.all(results);
}

module.exports = success;
