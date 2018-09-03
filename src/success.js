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
      Authorization: `Basic ${Buffer.from(
        env.JIRA_USER + ":" + env.JIRA_PASS
      ).toString("base64")}`
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
          logger.debug(`Updating ${issueKey} with ${body}`);

          const response = await fetch(url, {
            ...fetchOptions,
            body
          });

          if (!response.ok) {
            const responseText = await response.text();
            logger.error(
              `Error updating ${issueKey} (Code: ${
                response.status
              }): ${responseText}`
            );
            return {
              type: "error",
              issueKey,
              statusCode: response.status,
              responseText
            };
          }

          logger.success(`Successfully updated ${issueKey}`);
          return { type: "success", issueKey, statusCode: response.status };
        } catch (error) {
          logger.error(`Error trying to update ${issueKey}: `, error);
          return { type: "error", issueKey, error };
        }
      })
  );
}

module.exports = { success };
