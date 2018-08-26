const { template } = require("lodash");
const fetch = require("node-fetch");

const { parseCommitBody } = require("./functions/parseCommitBody.js");

const successConfigDefaults = {
  apiJSON: '{ update: { labels: [ { add: "released-in:${version}" } ] } }'
};

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
    logger
  } = context;
  const { apiURL, apiJSON } = pluginConfig;

  if (!apiURL) {
    logger.error("options.apiURL must be set and not empty");
    return;
  }

  const body = template(apiJSON ? apiJSON : successConfigDefaults.apiJSON)({
    version
  });

  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authentication: `Basic ${btoa(env.USER_NAME + ":" + env.USER_PASS)}`
    }
  };

  return await Promise.all(
    commits
      .reduce((issueKeys, commit) => {
        const { body } = commit;
        return issueKeys.concat(parseCommitBody(body));
      }, [])
      .map(async issueKey => {
        const url = template(apiURL)({ issueKey });
        try {
          const response = await fetch(url, {
            ...fetchOptions,
            body
          });
          logger.success(`Successfully updated Issue: ${issueKey}`);
          logger.debug(
            `API Response (Code: ${response.status}): ${await response.text()}`
          );
          return { type: "success", issueKey, statusCode: response.status };
        } catch (error) {
          logger.error(`Error (${issueKey}): `, error);
          return { type: "error", issueKey, error };
        }
      })
  );
}

module.exports = { success };
