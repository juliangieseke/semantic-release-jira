# semantic-release-jira [![Build Status](https://travis-ci.org/juliangieseke/semantic-release-jira.svg?branch=master)](https://travis-ci.org/juliangieseke/semantic-release-jira)

---

👩‍🔬 Please be aware that this package is still experimental —
changes to the interface and underlying implementation are likely,
and future development or maintenance is not guaranteed.

---

This package provides a simple way to label JIRA issues with releases.

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
    "semantic-release-jira"
  ]
}
```
