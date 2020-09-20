const { getAuthHeader } = require("../getAuthHeader.js");

const auth = {
  type: "Basic",
  userEnvVar: "JIRA_USER",
  passEnvVar: "JIRA_PASS",
  tokenEnvVar: "JIRA_TOKEN",
};
const env = {
  JIRA_USER: "Bender",
  JIRA_PASS: "K1ll-aLL-hum4nz!",
  JIRA_TOKEN: "foo",
};
const logger = {
  success: console.log,
  error: console.log,
  debug: console.log,
};

describe("getAuthHeader", () => {
  it("generates correct Basic header", async () => {
    expect.assertions(1);

    expect(getAuthHeader({ auth, env, logger })).toEqual(
      "Basic QmVuZGVyOksxbGwtYUxMLWh1bTRueiE="
    );
  });
  it("generates correct Bearer header", async () => {
    expect.assertions(1);

    expect(
      getAuthHeader({ auth: { ...auth, type: "Bearer" }, env, logger })
    ).toEqual("Bearer foo");
  });
  it("generates correct JWT header", async () => {
    expect.assertions(1);

    expect(
      getAuthHeader({ auth: { ...auth, type: "JWT" }, env, logger })
    ).toEqual("JWT foo");
  });

  it("errors with missing user (basic)", async () => {
    expect.assertions(1);

    expect(getAuthHeader({ auth: { type: "Basic" }, env, logger })).toEqual(
      false
    );
  });
});
