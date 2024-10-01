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

xml_release:
    #!/bin/bash
    gh release view --json tagName,publishedAt,url,body \
      | yq -p json -o xml '
        {"release": {
          "+@version": (.tagName | sub("v", "")),
          "+@type": "stable",
          "+@date": (.publishedAt),
          "url": .url,
          "description": "<p>" + .body + "</p>"}
      }'

flatpak:
    #!/bin/bash
    . ~/.bashrc

    release_tag="$(
      gh release list \
        --limit 1 --exclude-drafts --exclude-pre-releases \
        --json tagName | jq -r .[0].tagName
    )"
    version_semver="$(echo $release_tag | tr -d v)"
    logparam "Latest release is" "$release_tag" "(" "$version_semver" ")"

    json_release=$(
        gh release view $release_tag --json assets \
          | jq -r '
            .assets
            | map(select(.url | endswith(".tar.gz")))
            [0]
          '
    )

    commit_hash="$(git rev-list -n 1 $release_tag)"
    logparam "Release tag" "$release_tag" "has commit hash" "$commit_hash"

    tarurl="$(echo $json_release | jq -r .url)"

    tar_tmp="$(mktemp)"
    wget "$tarurl" -O "$tar_tmp"
    sha="$(cat "$tar_tmp" | sha256sum | cut -d' ' -f1)"

    logparam "Tarball is" "$tarurl" "with sha" "$sha"
    rm "$tar_tmp"

    logmajor "Updating flathub repo"
    git_clone_or_update git@github.com:flathub/dev.bambosh.UnofficialHomestuckCollection.git
    cd dev.bambosh.UnofficialHomestuckCollection

    flat_branch="update-$release_tag"
    logparam "Creating new working branch" "$flat_branch"
    git checkout -b "$flat_branch"

    j2 ../build/dev.bambosh.UnofficialHomestuckCollection.yml.j2 \
      --data '{
        "pkgver": "'$version_semver'",
        "asset_url": "'$tarurl'",
        "asset_sha": "'$sha'",
        "commit_hash": "'$commit_hash'"
      }' \
      --print > dev.bambosh.UnofficialHomestuckCollection.yml

    git --no-pager diff
    confirm

    git add dev.bambosh.UnofficialHomestuckCollection.yml
    git commit -m "Automatic version update"
    git push --set-upstream origin "$flat_branch"
    gh pr create --title "Automatic version update to $release_tag" --body ""
