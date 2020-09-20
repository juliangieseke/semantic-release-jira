const getAuthHeader = ({ auth, env, logger }) => {
  const type = auth.type;
  const user = env[auth.userEnvVar];
  const password = env[auth.passEnvVar];
  const token = env[auth.tokenEnvVar];

  //   logger.debug({ type, token, user, password });

  if (type == "Basic") {
    if (!user || !password) {
      logger.error(
        "failed to generate auth header, user or password missing for Basic."
      );
      return false;
    }
    return `Basic ${Buffer.from(user + ":" + password).toString("base64")}`;
  }
  if (!type || !token) {
    logger.error("failed to generate auth header, type or token missing");
    return false;
  }
  return `${type} ${token}`;
};

module.exports = { getAuthHeader };
