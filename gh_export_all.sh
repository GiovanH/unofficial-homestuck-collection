#!/bin/bash -i

set -eu -o pipefail

mkdir -p github

if ! gh auth status | grep -q 'read:project'; then
  (set -x; gh auth login --scopes read:project)
fi

(

  echo Saving PRs

  pr_out="github/pull_requests.json"
  # all_pr_fields="$(echo $(gh pr list --json 2>&1 | tail -n +2) | sed 's/ /,/g')"
  # gh pr list -L 50 --json "$all_pr_fields" | jq > $pr_out
  gh api repos/bambosh/unofficial-homestuck-collection/pulls --paginate > $pr_out

  logparam "Saved" $(jq '.|length' < "$pr_out") "pull requests to" "$pr_out"
)

(
  echo Saving Issues

  issue_out="github/issues.json"
  # all_issue_fields="$(echo $(gh issue list --json 2>&1 | tail -n +2) | sed 's/ /,/g')"
  # gh issue list -L 50 --json "$all_issue_fields" | jq > $issue_out
  gh api repos/bambosh/unofficial-homestuck-collection/issues --paginate > $issue_out

  logparam "Saved" $(jq '.|length' < "$issue_out") "issues to" "$issue_out"
)