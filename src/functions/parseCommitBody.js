/**
 * parses commit body and searches for issue numbers
 *
 * @param {string} body message to parse
 * @returns {string[]} array containing issue numbers
 */
const parseCommitBody = function(body) {
  if (!body) {
    return [];
  }

  const regEx = /((updates?|resolves?|closes?):? \"?([A-Z][A-Z0-9_]+\-[0-9]+)\"?)/gi;
  const bodyLines = body.trim().split("\n");
  const lastEmptyLine = bodyLines.lastIndexOf("");

  const matches = bodyLines
    .slice(lastEmptyLine)
    .join("\n")
    .match(regEx);

  const issues =
    matches !== null
      ? matches.map(match =>
          match.replace(/\"|updates?|resolves?|closes?:?\s/gi, "").trim()
        )
      : [];

  return issues;
};

module.exports = { parseCommitBody };
