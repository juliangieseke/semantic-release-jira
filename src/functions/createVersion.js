const { template } = require("lodash");
const fetch = require("node-fetch");

const createVersion = async (params) => {
  const { apiURL, token, version, project, logger } = params;

  logger.debug(`Creating version ${version} in project ${project}`);

  const response = await fetch(`${apiURL}version`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
    body: template(
      '{ "name": "${version}", "archived": false, "released": true, "project": "${project}"}'
    )({
      version,
      project,
    }),
  }).catch((e) => {
    logger.debug(e);
  });

  if (!response || response.status >= 400) {
    logger.debug(response);
    logger.debug(`Failed creating version ${version} in project ${project}`);
    return false;
  }

  logger.debug(`Successfully created version ${version} in project ${project}`);
  return true;
};

module.exports = { createVersion };
