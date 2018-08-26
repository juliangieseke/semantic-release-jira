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

  const regEx = /((updates|resolves|closes)\s(\"[^\"]+\"|[^,\s]+))/gi;
  const bodyLines = body.trim().split("\n");
  const lastEmptyLine = bodyLines.lastIndexOf("");

  return bodyLines
    .slice(lastEmptyLine)
    .join("\n")
    .match(regEx)
    .map(match => match.replace(/\"|updates|resolves|closes\s/gi, "").trim());
};

module.exports = { parseCommitBody };
