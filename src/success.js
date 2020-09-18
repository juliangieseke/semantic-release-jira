const { template } = require("lodash");

const { parseCommitBody } = require("./functions/parseCommitBody.js");
const { createVersion } = require("./functions/createVersion.js");
const { updateJIRA } = require("./functions/updateJIRA.js");

/**
 * success plugin method which updates JIRA Issues
 *
 * @async
 * @param {object} pluginConfig config passed in by semantic-release
 * @param {object} context plugin context passed in by semantic-release
 */
async function success(pluginConfig, context) {
  const { commits, nextRelease, env, logger } = context;
  const { apiURL, versionTmpl } = pluginConfig;
  const token = Buffer.from(env.JIRA_USER + ":" + env.JIRA_PASS).toString(
    "base64"
  );

  if (!apiURL) {
    logger.error("options.apiURL must be set and not empty");
    return;
  }
  if (!versionTmpl) {
    logger.error("options.versionTmpl must be set and not empty");
    return;
  }
  if (!token) {
    logger.error("cant parse JIRA credentials");
    return;
  }

  const version = template(versionTmpl)({ version: nextRelease.version });

  return Promise.all(
    commits
      .reduce((issueKeys, commit) => {
        const { body } = commit;
        return issueKeys.concat(parseCommitBody(body));
      }, [])
      .map(async (issueKey) => {
        logger.debug(`Updating ${issueKey} with ${version}`);

        const versionCreated = await createVersion({
          apiURL,
          token,
          version,
          project: issueKey.split("-")[0],
          logger,
        });
        if (!versionCreated) {
          logger.error(
            `Failed to create version ${version} for JIRA ${issueKey}`
          );
          return false;
        }
        const jiraUpdated = await updateJIRA({
          apiURL,
          token,
          version,
          issueKey,
          logger,
        });
        if (!jiraUpdated) {
          logger.error(
            `Failed to update JIRA ${issueKey} with version ${version}`
          );
          return false;
        }

        logger.success(
          `Successfully updated ${issueKey} with version ${version}`
        );
        return true;
      })
  );
}

module.exports = { success };
