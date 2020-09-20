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
    ["semantic-release-jira", {
      "auth": {
        "type": "Bearer",
        "userEnvVar": "JIRA_USER",
        "passEnvVar": "JIRA_PASS",
        "tokenEnvVar": undefined
      }
      "actions": [
        {
          "method": "POST",
          "url": "https://jira.example.com/rest/api/2/versions",
          "body": '{ "name": "${version}", "archived": false, "released": true, "project": "${project}"}'
        },
        {
          "method": "PUT",
          "url": "https://jira.example.com/rest/api/2/issues/${issueKey}",
          "body": '{"update":{"labels":[{"add":"some-component:${version}"}]}}'
        },
        {
          "method": "PUT",
          "url": "https://jira.example.com/rest/api/2/issues/${issueKey}",
          "body": '{"update":{"fixVersions":[{"add":{"name":"Some Component ${version}"}}]}}'
        },
        {
          "method":"POST",
          "url": "https://jira.d2iq.com/rest/api/2/issue/${issueKey}/transitions",
          "body": '{"transition":{"id":151}}'
        }
      ]
    }]
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

See example above.
