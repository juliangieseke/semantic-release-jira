const fetch = require("jest-fetch-mock");
jest.setMock("node-fetch", fetch);

const jiraApiCall = require("../jiraApiCall.js");

const issueKey = "FOO-12345";
const version = "1.1.1";
const authHeader = "Token foobar==";
const action = {
  method: "POST",
  url: "https://jira.example.com/rest/api/2/versions",
  body:
    '{ "name": "FooComponent ${version}", "archived": false, "released": true, "project": "${project}"}',
};
const logger = {
  success: () => {},
  error: () => {},
  debug: () => {},
  info: () => {},
};

describe("jiraApiCall", () => {
  it("is able to jiraApiCall (happy path)", async () => {
    const successLogger = jest.fn();
    expect.assertions(2);
    fetch.mockResponse(JSON.stringify({ json: true }));
    expect(
      await jiraApiCall({
        issueKey,
        authHeader,
        version,
        action,
        logger: { ...logger, success: successLogger },
      })
    ).toEqual({ json: true });
    expect(successLogger).toHaveBeenCalledWith(
      `[FOO-12345] Action "https://jira.example.com/rest/api/2/versions" done.`
    );
  });
});
