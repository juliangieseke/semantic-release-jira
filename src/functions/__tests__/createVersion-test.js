const fetch = require("jest-fetch-mock");
jest.setMock("node-fetch", fetch);

const { createVersion } = require("../createVersion.js");

const params = {
  token: "some_token",
  version: "Some UI ${version}",
  project: "EXPL",
  apiURL: "https://jira.example.com/rest/api/2/",
};

describe("createVersion", () => {
  it("is able to create version (happy path)", async () => {
    expect.assertions(1);
    fetch.once("");
    const logger = { debug: jest.fn(console.log) };
    expect(await createVersion({ ...params, logger })).toEqual(true);
  });

  it("errors with missing params", async () => {
    expect.assertions(2);
    fetch.mockReject(new Error("fake error message"));
    const logger = { debug: jest.fn(console.log) };
    expect(await createVersion({ ...params, logger })).toEqual(false);
    expect(logger.debug).toBeCalled();
  });
});
