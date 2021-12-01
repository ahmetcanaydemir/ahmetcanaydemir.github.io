---
title: Git Hooks: Enforce Commit Message and Branch Name
date: '2021-12-01'
spoiler: Branch and commit rules with git hooks
---

[](/x/)

If you want to standardize things among your team, you may need to enforce strict rules. Some examples of rules might be for git are:
- Branches must be created as ISSUE-0000/feature-name.
- All commit messages must start with ISSUE-0000 (Jira issue id).

In this post I will show you how we can add the two rules I mentioned using git hooks.

---

There are multiple [git hooks](https://git-scm.com/docs/githooks) that work in different stages. We will use two client side hooks for our rules.

- **pre-commit:** This hook is invoked by git-commit, and can be bypassed with the `--no-verify` option. We will use this hook for checking the branch name before commit.
- **commit-msg:** This hook is invoked by git-commit and git-merge, and can be bypassed with the `--no-verify` option. It takes a single parameter, the name of the file that holds the proposed commit message. We will use this hook for checking the commit message. And we will modify the commit message if needed.

## Creating Hooks Folder

Go to your home directory and create a folder named `hooks`. And create hook files.

```bash
mkdir ~/hooks
cd ~/hooks

touch pre-commit
chmod +x pre-commit

touch commit-msg
chmod +x commit-msg
```

---

## Restricting Branch Names

We will accept branch names as ISSUE-0000/feature-name but we have to consider also other branch names like `main`, `develop`, `release` etc. For this we can use following regular expression.

```bash
REGEX_ISSUE_ID="^(ISSUE-[0-9]+\/([a-zA-Z0-9]|-)+|develop|main|release"
```

We also need the branch name:
```bash
git rev-parse --abbrev-ref HEAD
```

Thats it! We have regex and we have branch name. We will check for branch name starts with `ISSUE-0000/feature-name` or `develop` or `main` or `release`. If our check fails we will echo our error message and exit with `exit code 1`.

`pre-commit`
```bash
#!/bin/bash

REGEX_ISSUE_ID="^(ISSUE-[0-9]+\/([a-zA-Z0-9]|-)+|develop|main|release"

ISSUE_ID_IN_BRANCH=$(echo $(git rev-parse --abbrev-ref HEAD) | grep -o -E "$REGEX_ISSUE_ID")

if [[ -z "$ISSUE_ID_IN_BRANCH" ]]; then
    echo "[pre-commit-hook] Your branch name is illegal. Please rename your branch with using following regex: $REGEX_ISSUE_ID"
    exit 1
fi
```

---

## Restricting Commit Messages


Steps are similar to restricting branch names. But if there is no issue id in the commit message, we will look at the branch name and try to get it from there. If issue id is also not in branch name, we will throw an error.

```bash
REGEX_ISSUE_ID="^(ISSUE-[0-9]+|Merge|hotfix)"
```

Our first argument `$1` gives us commit-msg file. We can read commit message with following command:
```bash
cat "$1"
```

We have regex and we have commit message name, and from last step we know how to get branch name. We will check for commit message starts with `ISSUE-0000` or `Merge` or `hotfix`.

If commit check fails we will check our branch name and parse the issue id and insert to commit message.

If our check fails again we will echo our error message and exit with `exit code 1`.

`commit-msg`
```bash
#!/bin/bash

REGEX_ISSUE_ID="^(ISSUE-[0-9]+|Merge|hotfix)"
ISSUE_ID_IN_COMMIT=$(echo $(cat "$1") | grep -o -E "$REGEX_ISSUE_ID")

if [[ -z "$ISSUE_ID_IN_COMMIT" ]]; then
    BRANCH_NAME=$(git symbolic-ref --short HEAD)
    ISSUE_ID=$(echo "$BRANCH_NAME" | grep -o -E "$REGEX_ISSUE_ID")

    if [[ -z "$ISSUE_ID" ]]; then
        echo "[commit-msg-hook] Your commit message is illegal. Please rename your branch with using following regex: $REGEX_ISSUE_ID"
        exit 1
    fi

    echo "$ISSUE_ID | $(cat "$1")" > "$1"
fi
```

---

## Usage

Go to project folder and run following command to use your hooks. You need to make this for every project that you want to use hooks.
```bash
cd <your-team-repository>
git config core.hooksPath ~/hooks
```

---

## Sharing With Team Members

You need to share your `~/hooks` folder. You can share with a git repository or you can send folder directly to your team.