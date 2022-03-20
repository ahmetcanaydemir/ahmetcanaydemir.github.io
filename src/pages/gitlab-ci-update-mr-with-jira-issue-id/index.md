---
title: 'GitLab CI: Update MR with Jira Issue Id'
date: '2021-12-02'
spoiler: 'Update MR title and description with Jira Issue Id'
---

In [my previous article](/git-hooks-enforce-commit-message-and-branch-name/), we enforced branch names and commit messages to certain rules. Now I will go a step further. When an MR is opened, if there is a Jira issue id (eg. ISSUE-0000) in the title, we will pull the Jira title and description and update MR. CI will fail if there is no Jira Issue Id in the title.

---

To do this, we can briefly follow these steps.

1. Check if there is an issue id in the MR title. Otherwise, return fail exit code. We will use regex for this. `$CI_MERGE_REQUEST_TITLE` will give us the MR header.
2. Extract Issue Id and pull data from Jira API. When you make a GET request to the `https://jira.<your-hostname>/rest/api/2/issue/ISSUE-0000` Jira address, Issue details will be returned to you as JSON.
3. Take the `summary` and `description` parts from the JSON data returned by Jira API with `jq` and assign them to variables.
4. Update MR's title and description using GitLab API.

---

## Curl ve jq Setup

We need `curl` for our API requests and `jq` to parse JSON.

```bash
apk add --update curl && apk add --update jq && rm -rf /var/cache/apk/*
```

---

## Issue Id Check

```bash
REGEX_ISSUE_ID="^(ISSUE-[0-9]+)"
ISSUE_ID_IN_MR=$(echo "$CI_MERGE_REQUEST_TITLE" | grep -o -E "$REGEX_ISSUE_ID")
[[ -z "$ISSUE_ID_IN_MR" ]]; then exit 1; fi 
```

---

## Jira Issue Parsing

We store new lines (eg. `\n`) as characters in `DESCRIPTION_JSON` variable because newlines are the problem when sending curl requests.

```bash
JSON=$(curl -s -u <jira-username>:<jira-password> -X GET -H "Content-Type:application/json" "https://jira.<your-hostname>/rest/api/2/issue/$ISSUE_ID_IN_MR")

SUMMARY=$(echo "$JSON" | jq -r ".fields.summary")
DESCRIPTION=$(echo "$JSON" | jq -r ".fields.description")
DESCRIPTION_JSON=$(jq --null-input --compact-output --arg msg "$DESCRIPTION" '$msg')
```

---

## Updating Merge Request

You need a private token for this [check GitLab documentation](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) and learn how to do that.

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

When we combine all this into one GitLab CI yml file it will look like this.

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

You should add this file you created to your GitLab project as a CI file. After all these processes, your MR titles and descriptions will now be much more organized and understandable!
