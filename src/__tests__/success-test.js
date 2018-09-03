const fetch = require("jest-fetch-mock");
jest.setMock("node-fetch", fetch);

const { success } = require("../success.js");

const issueKey = "issue-123";
const testVersion = "1.0.0";
const validConfig = {
  apiURL: "https://jira.example.com/browse/${issueKey}",
  apiJSON: '{ update: { labels: [ { add: "released-in-test:${version}" } ] } }'
};
const validContext = {
  nextRelease: { version: testVersion },
  commits: [{ body: `lorem\ncloses ${issueKey}`, commit: { short: "aaa" } }],
  logger: {
    success: () => {},
    error: () => {},
    debug: () => {}
  },
  env: { JIRA_USER: "Bender", JIRA_PASS: "K1ll-aLL-hum4nz!" }
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
        logger: { ...validContext.logger, error: errorLogger }
      }
    );
    expect(errorLogger).toBeCalledWith(
      "options.apiURL must be set and not empty"
    );
  });

  it("logs error with empty apiURL", async () => {
    expect.assertions(1);
    const errorLogger = jest.fn();
    await success(
      { apiURL: "" },
      {
        ...validContext,
        logger: { ...validContext.logger, error: errorLogger }
      }
    );
    expect(errorLogger).toBeCalledWith(
      "options.apiURL must be set and not empty"
    );
  });

  it("sets default apiJSON when necessary and parses it correctly", async () => {
    expect.assertions(1);
    const { apiURL } = validConfig;

    await success({ apiURL }, { ...validContext });

    expect(fetch.mock.calls[0][1].body).toEqual(
      `{ update: { labels: [ { add: "released-in:${testVersion}" } ] } }`
    );
  });

  it("keeps passed in apiJSON and parses it correctly", async () => {
    expect.assertions(1);
    const { apiURL, apiJSON } = validConfig;
    const config = { apiURL, apiJSON };

    await success(config, { ...validContext });

    expect(fetch.mock.calls[0][1].body).toEqual(
      `{ update: { labels: [ { add: "released-in-test:${testVersion}" } ] } }`
    );
  });

  it("correctly parses url", async () => {
    expect.assertions(1);
    const { apiURL, apiJSON } = validConfig;
    const config = { apiURL, apiJSON };

    await success(config, { ...validContext });

    expect(fetch.mock.calls[0][0]).toEqual(
      `https://jira.example.com/browse/${issueKey}`
    );
  });

  it("correctly sets authentication header", async () => {
    expect.assertions(1);
    const { apiURL, apiJSON } = validConfig;
    const config = { apiURL, apiJSON };

    await success(config, { ...validContext });

    expect(fetch.mock.calls[0][1].headers.Authentication).toEqual(
      `Basic ${Buffer.from(
        validContext.env.JIRA_NAME + ":" + validContext.env.JIRA_PASS
      ).toString("base64")}`
    );
  });

  it("successfully updates issue with correct data", async () => {
    expect.assertions(3);
    const successLogger = jest.fn();
    const errorLogger = jest.fn();

    fetch.once(""); // mocks successfull API call

    await expect(
      success(
        { ...validConfig },
        {
          ...validContext,
          logger: {
            ...validContext.logger,
            success: successLogger,
            error: errorLogger
          }
        }
      )
    ).resolves.toBeTruthy();
    expect(successLogger).toHaveBeenCalledWith(
      `Successfully updated Issue: ${issueKey}`
    );
    expect(errorLogger).not.toHaveBeenCalled();
  });
});
