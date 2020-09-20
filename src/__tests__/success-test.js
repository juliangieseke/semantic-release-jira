const fetch = require("jest-fetch-mock");
jest.setMock("node-fetch", fetch);

const { success } = require("../success.js");

const testVersion = "1.0.0";
const validConfig = {
  auth: {
    type: "Basic",
    userEnvVar: "JIRA_USER",
    passEnvVar: "JIRA_PASS",
    tokenEnvVar: undefined,
  },
  actions: [
    {
      method: "POST",
      url: "https://jira.example.com/rest/api/2/versions",
      body:
        '{ "name": "${version}", "archived": false, "released": true, "project": "${project}"}',
    },
    {
      method: "PUT",
      url: "https://jira.example.com/rest/api/2/issues/${issueKey}",
      body: '{"update":{"labels":[{"add":"some-component:${version}"}]}}',
    },
    {
      method: "PUT",
      url: "https://jira.example.com/rest/api/2/issues/${issueKey}",
      body:
        '{"update":{"fixVersions":[{"add":{"name":"Some Component ${version}"}}]}}',
    },
    {
      method: "POST",
      url: "https://jira.d2iq.com/rest/api/2/issue/${issueKey}/transitions",
      body: '{"transition":{"id":151}}',
    },
  ],
};
const validContext = {
  nextRelease: { version: testVersion },
  commits: [
    { body: `lorem\ncloses issue-123`, commit: { short: "aaa" } },
    { body: `lorem\nresolves issue-456`, commit: { short: "bbb" } },
  ],
  logger: {
    success: console.log,
    error: console.error,
    debug: console.debug,
    info: console.info,
  },
  env: { JIRA_USER: "Bender", JIRA_PASS: "K1ll-aLL-hum4nz!" },
};

describe("success", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("successfully updates issue with correct data", async () => {
    expect.assertions(1);

    fetch.mockResponse(""); // mocks successfull API call
    const r = success(
      { ...validConfig },
      {
        ...validContext,
        logger: {
          ...validContext.logger,
        },
      }
    );
    expect(await r).toEqual([true, true, true, true, true, true, true, true]);
  });
});
