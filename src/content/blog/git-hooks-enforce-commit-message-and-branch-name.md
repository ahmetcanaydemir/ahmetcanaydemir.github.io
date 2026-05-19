---
title: 'Git Hooks: Enforce Commit Message and Branch Name'
date: '2021-12-01'
description: 'Branch and commit rules with git hooks.'
---

If you want to keep things consistent across a team, you may need to enforce some strict rules. A few examples of what those rules could look like:

- Branches must be created as `ISSUE-0000/feature-name`.
- All commit messages must start with `ISSUE-0000` (a Jira issue ID).

In this post, I'll show you how to enforce these two rules using git hooks.

---

There are several [git hooks](https://git-scm.com/docs/githooks) that fire at different stages. We'll use two client-side hooks for our rules:

- **pre-commit:** Invoked by `git commit`, and can be bypassed with `--no-verify`. We'll use it to check the branch name before each commit.
- **commit-msg:** Invoked by `git commit` and `git merge`, and can be bypassed with `--no-verify`. It receives a single parameter — the path to the file holding the proposed commit message. We'll use it to check the commit message and modify it if needed.

## Creating the Hooks Folder

Go to your home directory, create a folder named `hooks`, and create the hook files:

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

We'll accept branch names like `ISSUE-0000/feature-name`, but we also need to allow conventional names like `main`, `develop`, and `release`. The following regex covers all of those:

```bash
REGEX_ISSUE_ID="^(ISSUE-[0-9]+\/([a-zA-Z0-9]|-)+|develop|main|release"
```

We also need to know the current branch name:

```bash
git rev-parse --abbrev-ref HEAD
```

That's it — we have the regex and we have the branch name. We check whether the branch name starts with `ISSUE-0000/feature-name`, `develop`, `main`, or `release`. If the check fails, we print an error and exit with code `1`.

`pre-commit`:

```bash
#!/bin/bash

REGEX_ISSUE_ID="^(ISSUE-[0-9]+\/([a-zA-Z0-9]|-)+|develop|main|release"

ISSUE_ID_IN_BRANCH=$(echo $(git rev-parse --abbrev-ref HEAD) | grep -o -E "$REGEX_ISSUE_ID")

if [[ -z "$ISSUE_ID_IN_BRANCH" ]]; then
    echo "[pre-commit-hook] Your branch name is invalid. Please rename your branch using the following regex: $REGEX_ISSUE_ID"
    exit 1
fi
```

---

## Restricting Commit Messages

The steps are similar to restricting branch names. But if there's no issue ID in the commit message, we'll fall back to the branch name and try to extract one from there. If neither has an issue ID, we'll throw an error.

```bash
REGEX_ISSUE_ID="^(ISSUE-[0-9]+|Merge|hotfix)"
```

The first argument `$1` gives us the path to the commit message file. We can read its contents with:

```bash
cat "$1"
```

We have the regex, we have the commit message, and from the previous step we know how to get the branch name. We check that the commit message starts with `ISSUE-0000`, `Merge`, or `hotfix`.

If the commit-message check fails, we look at the branch name, extract the issue ID, and prepend it to the commit message.

If that check fails too, we print an error and exit with code `1`.

`commit-msg`:

```bash
#!/bin/bash

REGEX_ISSUE_ID="^(ISSUE-[0-9]+|Merge|hotfix)"
ISSUE_ID_IN_COMMIT=$(echo $(cat "$1") | grep -o -E "$REGEX_ISSUE_ID")

if [[ -z "$ISSUE_ID_IN_COMMIT" ]]; then
    BRANCH_NAME=$(git symbolic-ref --short HEAD)
    ISSUE_ID=$(echo "$BRANCH_NAME" | grep -o -E "$REGEX_ISSUE_ID")

    if [[ -z "$ISSUE_ID" ]]; then
        echo "[commit-msg-hook] Your commit message is invalid. Please rename your branch using the following regex: $REGEX_ISSUE_ID"
        exit 1
    fi

    echo "$ISSUE_ID | $(cat "$1")" > "$1"
fi
```

---

## Usage

Go into your project folder and run the following to enable the hooks. You'll need to do this for every repository where you want them active:

```bash
cd <your-team-repository>
git config core.hooksPath ~/hooks
```

---

## Sharing With Team Members

You'll want to share your `~/hooks` folder with the rest of the team. You can either commit it to a git repository or send the folder directly.
