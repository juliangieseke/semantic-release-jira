const { verifyConditions } = require("../verifyConditions.js");

const validContext = {
  env: { JIRA_USER: "Bender", JIRA_PASS: "K1ll-aLL-hum4nz!" }
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
        env: { JIRA_USER }
      } = validContext;
      expect(verifyConditions({}, { env: { JIRA_USER } })).rejects.toThrow();
    });

    it("throws with missing user env var", () => {
      expect.assertions(1);
      const {
        env: { JIRA_PASS }
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

  it("succeeds with all necessary arguments", async () => {
    expect.assertions(1);
    await expect(
      verifyConditions({}, { ...validContext })
    ).resolves.toBeTruthy();
  });
});
