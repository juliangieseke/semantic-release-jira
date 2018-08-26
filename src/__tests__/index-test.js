const {
  verifyConditionsErrorMessage,
  verifyConditions,
  success
} = require("../index.js");

describe("verifyConditions", () => {
  it("throws without env vars", async () => {
    await expect(verifyConditions({}, { env: {} })).rejects.toThrowError(
      verifyConditionsErrorMessage
    );
  });

  it("throws with missing password env var", async () => {
    await expect(
      verifyConditions({}, { env: { JIRA_USER: "Bender" } })
    ).rejects.toThrowError(verifyConditionsErrorMessage);
  });

  it("throws with missing user env var", async () => {
    await expect(
      verifyConditions({}, { env: { JIRA_PASS: "K1ll-aLL-hum4nz!" } })
    ).rejects.toThrowError(verifyConditionsErrorMessage);
  });

  it("throws with empty password env var", async () => {
    await expect(
      verifyConditions({}, { env: { JIRA_USER: "" } })
    ).rejects.toThrowError(verifyConditionsErrorMessage);
  });

  it("throws with empty user env var", async () => {
    await expect(
      verifyConditions({}, { env: { JIRA_PASS: "" } })
    ).rejects.toThrowError(verifyConditionsErrorMessage);
  });

  it("succeeds with user and pass env vars", async () => {
    await expect(
      verifyConditions(
        {},
        { env: { JIRA_USER: "Bender", JIRA_PASS: "K1ll-aLL-hum4nz!" } }
      )
    ).resolves;
  });
});

describe("success", () => {
  it("initializes", () => {
    const loggerSuccess = jest.fn();
    expect(() =>
      success({}, { logger: { success: loggerSuccess } })
    ).not.toThrow();
  });
});
