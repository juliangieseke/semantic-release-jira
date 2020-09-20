const { verifyConditions } = require("../verifyConditions.js");

const validContext = {
  logger: {
    success: console.log,
    error: console.log,
    debug: console.log,
  },
  env: {
    JIRA_USER: "Bender",
    JIRA_PASS: "K1ll-aLL-hum4nz!",
    JIRA_TOKEN: "foo",
  },
};
const validConfig = {
  auth: {
    type: "Basic",
    userEnvVar: "JIRA_USER",
    passEnvVar: "JIRA_PASS",
    tokenEnvVar: "JIRA_TOKEN",
  },
};

describe("verifyConditions", () => {
  describe("context", () => {
    it("throws without env vars", () => {
      expect.assertions(1);
      expect(verifyConditions({}, { env: {} })).rejects.toThrow();
    });

    it("throws with missing password env var", () => {
      expect.assertions(1);
      const {
        env: { JIRA_USER },
      } = validContext;
      expect(verifyConditions({}, { env: { JIRA_USER } })).rejects.toThrow();
    });

    it("throws with missing user env var", () => {
      expect.assertions(1);
      const {
        env: { JIRA_PASS },
      } = validContext;
      expect(verifyConditions({}, { env: { JIRA_PASS } })).rejects.toThrow();
    });

    it("throws with empty password env var", () => {
      expect.assertions(1);
      expect(
        verifyConditions({}, { env: { JIRA_USER: "" } })
      ).rejects.toThrow();
    });

    it("throws with empty user env var", () => {
      expect.assertions(1);
      expect(
        verifyConditions({}, { env: { JIRA_PASS: "" } })
      ).rejects.toThrow();
    });
  });

  it("succeeds with all necessary arguments (Basic)", async () => {
    expect.assertions(1);
    await expect(
      verifyConditions({ ...validConfig }, { ...validContext })
    ).resolves.toBe(true);
  });

  it("succeeds with all necessary arguments (Bearer)", async () => {
    expect.assertions(1);
    await expect(
      verifyConditions(
        { auth: { ...validConfig.auth, type: "Bearer" } },
        { ...validContext }
      )
    ).resolves.toBe(true);
  });

  it("succeeds with all necessary arguments (JWT)", async () => {
    expect.assertions(1);
    await expect(
      verifyConditions(
        { auth: { ...validConfig.auth, type: "JWT" } },
        { ...validContext }
      )
    ).resolves.toBe(true);
  });
});
