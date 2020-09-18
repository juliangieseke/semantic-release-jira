const fetch = require("jest-fetch-mock");
jest.setMock("node-fetch", fetch);

const { updateJIRA } = require("../updateJIRA.js");

const params = {
  token: "some_token",
  version: "Some UI ${version}",
  project: "EXPL",
  apiURL: "https://jira.example.com/rest/api/2/",
  issueKey: "EXPL-12345",
};

describe("updateJIRA", () => {
  it("is able to updateJIRA (happy path)", async () => {
    expect.assertions(1);
    fetch.once("");
    const logger = { debug: jest.fn() };
    expect(await updateJIRA({ ...params, logger })).toEqual(true);
  });

  it("errors with missing params", async () => {
    expect.assertions(2);
    fetch.mockReject(new Error("fake error message"));
    const logger = { debug: jest.fn() };
    expect(await updateJIRA({ ...params, logger })).toEqual(false);
    expect(logger.debug).toBeCalled();
  });
});
