# semantic-release-jira [![Build Status](https://travis-ci.org/juliangieseke/semantic-release-jira.svg?branch=master)](https://travis-ci.org/juliangieseke/semantic-release-jira)

---

👩‍🔬 Please be aware that this package is still experimental —
changes to the interface and underlying implementation are likely,
and future development or maintenance is not guaranteed.

---

This package provides a simple way to label JIRA issues with releases.
Currently, it is only compatible with JIRA rest API v2 and login:password authentication

## Example

In `.releaserc`:

```js
{
  "verifyConditions": [
    "@semantic-release/github",
    "@semantic-release/npm",
    "semantic-release-jira"
  ]
  "success": [
    "@semantic-release/github",
    {
      "path": "semantic-release-jira",
      "apiURL": "https://jira.yourdomain.com/${issueKey}",
      "apiJSON": '{ "update": { "labels": [ { "add": "released-in:${version}" } ] } }'
    }
  ]
}
```

## Environment Variables

### `JIRA_USER`

User to login with JIRA, to be passed in as environment variable.

### `JIRA_PASS`

Password to login with JIRA, to be passed in as environment variable.

## Options

### `verifyConditions` step

This step doesnt support any options.

### `success` step

#### `apiURL`

JIRA REST API V2 URL - template string is parsed by [\_.template](https://lodash.com/docs/4.17.10#template)

#### `apiJSON`

JIRA REST API V2 Operation ([Examples](https://developer.atlassian.com/server/jira/platform/updating-an-issue-via-the-jira-rest-apis-6848604/))- template string is parsed by [\_.template](https://lodash.com/docs/4.17.10#template)
