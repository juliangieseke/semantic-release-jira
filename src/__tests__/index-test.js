const {
  verifyConditionsErrorMessage,
  verifyConditions,
  notify
} = require("../index.js");

// this helps a lot: https://github.com/felixfbecker/semantic-release-firefox/blob/master/src/semantic-release.ts
const defaultContext = {
  env: {},
  logger: { log: console.log, error: console.error, success: console.log }
};

const pluginConfig = {};

describe("verifyConditions", () => {
  it("throws without env vars", async () => {
    expect.assertions(1);
    try {
      await verifyConditions({}, { env: {} });
    } catch (e) {
      expect(e).toEqual(new Error(verifyConditionsErrorMessage));
    }
  });

  it("throws with missing password env var", async () => {
    expect.assertions(1);
    try {
      await verifyConditions({}, { env: { JIRA_USER: "Bender" } });
    } catch (e) {
      expect(e).toEqual(new Error(verifyConditionsErrorMessage));
    }
  });

  it("throws with missing user env var", async () => {
    expect.assertions(1);
    try {
      await verifyConditions({}, { env: { JIRA_PASS: "K1ll-aLL-hum4nz!" } });
    } catch (e) {
      expect(e).toEqual(new Error(verifyConditionsErrorMessage));
    }
  });

  it("succeeds with user and pass env vars", async () => {
    try {
      await verifyConditions(
        {},
        { env: { JIRA_USER: "Bender", JIRA_PASS: "K1ll-aLL-hum4nz!" } }
      );
    } catch (e) {
      expect(e).not.toEqual(new Error(verifyConditionsErrorMessage));
    }
  });
});

describe("notify", () => {
  it("initializes", () => {
    expect(() => notify(pluginConfig, defaultContext)).not.toThrow();
  });
});
