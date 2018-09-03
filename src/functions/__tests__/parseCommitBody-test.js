const { parseCommitBody } = require("../parseCommitBody.js");

describe("parseCommitBody", () => {
  it("returns empty array for empty string", () => {
    expect(parseCommitBody()).toEqual([]);
  });

  it("returns empty array for non matching string", () => {
    expect(parseCommitBody("foobar")).toEqual([]);
  });

  it("returns correct match for single issue", () => {
    expect(parseCommitBody("closes ISSUE-12345")).toEqual(["ISSUE-12345"]);
  });

  it("returns correct match for single issue (2)", () => {
    expect(parseCommitBody("Closes ISSUE-12345")).toEqual(["ISSUE-12345"]);
  });

  it("returns correct match for single issue with body", () => {
    expect(parseCommitBody("lorem ipsum\nlorem\n\ncloses ISSUE-12345")).toEqual(
      ["ISSUE-12345"]
    );
  });

  it("returns correct match for single issue with body (2)", () => {
    expect(parseCommitBody("lorem ipsum\nlorem\n\nCloses ISSUE-12345")).toEqual(
      ["ISSUE-12345"]
    );
  });

  it("returns correct match for single issue with body containing 'Updates'", () => {
    expect(
      parseCommitBody(
        "lorem ipsum Updates the door\nlorem\n\nUpdates ISSUE-12345"
      )
    ).toEqual(["ISSUE-12345"]);
  });

  it("returns correct match for single issue with body containing 'closes' (2)", () => {
    expect(
      parseCommitBody(
        "lorem ipsum Closes the door\nlorem\n\nCloses ISSUE-12345"
      )
    ).toEqual(["ISSUE-12345"]);
  });

  it("returns correct matches for multiple issues (,) with body containing 'updates'", () => {
    expect(
      parseCommitBody(
        "lorem ipsum updates the door\nlorem\n\nupdates ISSUE-12345, Closes ISSUE-23456"
      )
    ).toEqual(["ISSUE-12345", "ISSUE-23456"]);
  });

  it("returns correct matches for multiple issues ( ) with body containing 'resolves'", () => {
    expect(
      parseCommitBody(
        'lorem ipsum resolves the door\nlorem\n\nresolves "ISSUE-12345" Closes ISSUE-23456'
      )
    ).toEqual(["ISSUE-12345", "ISSUE-23456"]);
  });

  it("returns correct matches for multiple issues (\\n) with body containing 'closes'", () => {
    expect(
      parseCommitBody(
        "lorem ipsum closes the door\nlorem\n\ncloses ISSUE-12345\nCloses ISSUE-23456"
      )
    ).toEqual(["ISSUE-12345", "ISSUE-23456"]);
  });

  it("returns correct matches for quoted issue containing space", () => {
    expect(
      parseCommitBody(
        `lorem ipsum closes the door\nlorem\n\ncloses "ISSUE 12345" Closes ISSUE-23456`
      )
    ).toEqual(["ISSUE 12345", "ISSUE-23456"]);
  });

  it("only returns correct match for invalid issue references", () => {
    expect(
      parseCommitBody(
        "lorem ipsum closes the door\nlorem\n\ncloses ISSUE-12345, ISSUE-23456"
      )
    ).toEqual(["ISSUE-12345"]);
  });

  it("can handle (multiple) empty lines in message", () => {
    expect(
      parseCommitBody(
        "lorem ipsum\n\ncloses the\n\ndoor\n\n\ncloses ISSUE-12345"
      )
    ).toEqual(["ISSUE-12345"]);
  });
});
