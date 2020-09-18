const fetch = require("jest-fetch-mock");
jest.setMock("node-fetch", fetch);

const { success } = require("../success.js");

const issueKey = "issue-123";
const testVersion = "1.0.0";
const validConfig = {
  versionTmpl: "Some UI ${version}",
  apiURL: "https://jira.example.com/rest/api/2/",
};
const validContext = {
  nextRelease: { version: testVersion },
  commits: [{ body: `lorem\ncloses ${issueKey}`, commit: { short: "aaa" } }],
  logger: {
    success: () => {},
    error: () => {},
    debug: console.log,
  },
  env: { JIRA_USER: "Bender", JIRA_PASS: "K1ll-aLL-hum4nz!" },
};

describe("success", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("logs error without given apiURL", async () => {
    expect.assertions(1);
    const errorLogger = jest.fn();
    await success(
      {},
      {
        ...validContext,
        logger: { ...validContext.logger, error: errorLogger },
      }
    );
    expect(errorLogger).toBeCalledWith(
      "options.apiURL must be set and not empty"
    );
  });

  it("logs error with empty apiURL", async () => {
    expect.assertions(1);
    const errorLogger = jest.fn(console.log);
    await success(
      { apiURL: "" },
      {
        ...validContext,
        logger: { ...validContext.logger, error: errorLogger },
      }
    );
    expect(errorLogger).toBeCalledWith(
      "options.apiURL must be set and not empty"
    );
  });

  it("successfully updates issue with correct data", async () => {
    expect.assertions(3);
    const successLogger = jest.fn(console.log);
    const errorLogger = jest.fn(console.log);

    fetch.mockResponse(""); // mocks successfull API call

    await expect(
      success(
        { ...validConfig },
        {
          ...validContext,
          logger: {
            ...validContext.logger,
            success: successLogger,
            error: errorLogger,
          },
        }
      )
    ).resolves.toBeTruthy();
    expect(successLogger).toHaveBeenCalledTimes(1);
    expect(errorLogger).not.toHaveBeenCalled();
  });
});
