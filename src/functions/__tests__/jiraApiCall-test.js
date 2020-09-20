const fetch = require("jest-fetch-mock");
jest.setMock("node-fetch", fetch);

const jiraApiCall = require("../jiraApiCall.js");

const issueKey = "FOO-12345";
const version = "1.1.1";
const authHeader = "Token foobar==";
const action = {
  method: "POST",
  url: "https://jira.example.com/rest/api/2/version",
  body:
    '{ "name": "FooComponent ${version}", "archived": false, "released": true, "project": "${project}"}',
  ignoreErrors: ["A version with this name already exists in this project."],
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
      `[FOO-12345] Action "https://jira.example.com/rest/api/2/version" done.`
    );
  });
  it("handles null response", async () => {
    const successLogger = jest.fn();
    expect.assertions(2);
    fetch.mockResponse(null);
    expect(
      await jiraApiCall({
        issueKey,
        authHeader,
        version,
        action,
        logger: { ...logger, success: successLogger },
      })
    ).toEqual(
      "FetchError: invalid json response body at undefined reason: Unexpected end of JSON input"
    );
    expect(successLogger).toHaveBeenCalledWith(
      `[FOO-12345] Action "https://jira.example.com/rest/api/2/version" done.`
    );
  });
  it("ignores set errors", async () => {
    const successLogger = jest.fn();
    expect.assertions(2);
    fetch.mockResponse(
      JSON.stringify({
        errorMessages: [],
        errors: {
          name: "A version with this name already exists in this project.",
        },
      })
    );
    expect(
      await jiraApiCall({
        issueKey,
        authHeader,
        version,
        action,
        logger: { ...logger, success: successLogger },
      })
    ).toEqual({
      errorMessages: [],
      errors: {
        name: "A version with this name already exists in this project.",
      },
    });
    expect(successLogger).toHaveBeenCalledWith(
      `[FOO-12345] Action "https://jira.example.com/rest/api/2/version" done.`
    );
  });
});
