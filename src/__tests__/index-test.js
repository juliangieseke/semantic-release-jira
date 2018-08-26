const { verifyConditions, success } = require("../index.js");

describe("index", () => {
  it("correctly exports modules", () => {
    expect.assertions(2);
    expect(verifyConditions).not.toBeUndefined();
    expect(success).not.toBeUndefined();
  });
});
