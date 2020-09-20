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
  success: console.log,
  error: console.log,
  debug: console.log,
  info: console.log,
};

describe("jiraApiCall", () => {
  it("is able to jiraApiCall (happy path)", async () => {
    const successLogger = jest.fn(console.log);
    expect.assertions(2);
    fetch.once("");
    expect(
      await jiraApiCall({
        issueKey,
        authHeader,
        version,
        action,
        logger: { ...logger, success: successLogger },
      })
    ).toEqual(true);
    expect(successLogger).toHaveBeenCalledWith(
      `[FOO-12345] Action "https://jira.example.com/rest/api/2/versions" with body "{ "name": "FooComponent 1.1.1", "archived": false, "released": true, "project": "FOO"}" done.`
    );
  });
});
