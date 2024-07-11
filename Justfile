default:
    just --list

# construct 'future' git branch from stack
git-future:
    #!/bin/bash
    set -eu -o pipefail

    git checkout future

    git reset --hard develop

    for branch in $@; do
        git merge $branch
        git commit || :
    done
