---
title: 'GitLab CI: Update MR with Jira Issue ID'
date: '2021-12-02'
description: 'Update MR title and description with the Jira issue ID.'
---

In [my previous article](/git-hooks-enforce-commit-message-and-branch-name/), we enforced branch names and commit messages using git hooks. Now I'll take it one step further: when an MR is opened, if the title contains a Jira issue ID (e.g. `ISSUE-0000`), we'll fetch the Jira title and description and update the MR with them. The CI pipeline will fail if there's no Jira issue ID in the title.

---

The plan is roughly this:

1. Check whether the MR title contains an issue ID. If not, return a failing exit code. We'll use a regex for this. `$CI_MERGE_REQUEST_TITLE` gives us the MR title.
2. Extract the issue ID and pull data from the Jira API. A `GET` request to `https://jira.<your-hostname>/rest/api/2/issue/ISSUE-0000` returns issue details as JSON.
3. Read the `summary` and `description` fields from the JSON using `jq` and assign them to variables.
4. Update the MR title and description through the GitLab API.

---

## Curl and jq Setup

We need `curl` for our API requests and `jq` to parse JSON.

```bash
apk add --update curl && apk add --update jq && rm -rf /var/cache/apk/*
```

---

## Issue ID Check

```bash
REGEX_ISSUE_ID="^(ISSUE-[0-9]+)"
ISSUE_ID_IN_MR=$(echo "$CI_MERGE_REQUEST_TITLE" | grep -o -E "$REGEX_ISSUE_ID")
[[ -z "$ISSUE_ID_IN_MR" ]]; then exit 1; fi
```

---

## Parsing the Jira Issue

We store newline characters (`\n`) inside the `DESCRIPTION_JSON` variable because newlines cause problems when sent over a curl request.

```bash
JSON=$(curl -s -u <jira-username>:<jira-password> -X GET -H "Content-Type:application/json" "https://jira.<your-hostname>/rest/api/2/issue/$ISSUE_ID_IN_MR")

SUMMARY=$(echo "$JSON" | jq -r ".fields.summary")
DESCRIPTION=$(echo "$JSON" | jq -r ".fields.description")
DESCRIPTION_JSON=$(jq --null-input --compact-output --arg msg "$DESCRIPTION" '$msg')
```

---

## Updating the Merge Request

You'll need a GitLab personal access token. See the [GitLab documentation](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) for how to create one.

```bash
curl -v \
--data "{\"title\": \"${ISSUE_ID_IN_MR} ${SUMMARY}\"\"description\": ${DESCRIPTION_JSON}}" \
--fail \
--header "Content-Type:application/json; charset=utf-8" \
--header "PRIVATE-TOKEN:<private-token>" \
--output "/dev/null" \
--request PUT \
--show-error \
--silent \
--trace-ascii "/dev/stderr" \
--write-out "HTTP response: %{http_code}\n\n" \
"${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_request$CI_MERGE_REQUEST_IID"
```

---

## Result

When we put it all together into a single GitLab CI YAML file, it looks like this:

```yml
check_mr:
  image: alpine
  stage: test
  script:
    - apk add --update curl && apk add --update jq && rm -rf /var/cache/apk/*
    - IFS=$"\n"
    - REGEX_ISSUE_ID="^(ISSUE-[0-9]+)"
    - ISSUE_ID_IN_MR=$(echo "$CI_MERGE_REQUEST_TITLE" | grep -o -E "$REGEX_ISSUE_ID")
    - if [[ -z "$ISSUE_ID_IN_MR" ]]; then exit 1; fi
    - JSON=$(curl -s -u <jira-username>:<jira-password> -X GET -H "Content-Type:application/json" "https://jira.<your-hostname>/rest/api/2/issue/$ISSUE_ID_IN_MR")
    - SUMMARY=$(echo "$JSON" | jq -r ".fields.summary")
    - DESCRIPTION=$(echo "$JSON" | jq -r ".fields.description")
    - DESCRIPTION_JSON=$(jq --null-input --compact-output --arg msg "$DESCRIPTION" '$msg')
    - |
      curl -v \
      --data "{\"title\": \"${ISSUE_ID_IN_MR} ${SUMMARY}\", \"description\": ${DESCRIPTION_JSON}}" \
      --fail \
      --header "Content-Type:application/json; charset=utf-8" \
      --header "PRIVATE-TOKEN:<private-token>" \
      --output "/dev/null" \
      --request PUT \
      --show-error \
      --silent \
      --trace-ascii "/dev/stderr" \
      --write-out "HTTP response: %{http_code}\n\n" \
      "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/$CI_MERGE_REQUEST_IID"
    only:
      - merge_requests
```

---

Add this file to your GitLab project as a CI configuration. After all that, your MR titles and descriptions will be much more organized and easier to understand.
