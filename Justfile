default:
    just --list

# construct 'future' git branch from stack
git-future *args:
    #!/bin/bash
    set -eu -o pipefail

    git checkout future

    git reset --hard develop

    for branch in {{args}}; do
      git merge $branch
      git commit || :
    done

xml_release:
    #!/bin/bash -x
    release="$(gh release view --json tagName,publishedAt,url,body)"
    export body="$(echo "$release" | yq -p json '.body' | /usr/bin/env python3 -m markdown)"

    echo "$release" | yq -p json -o xml '. | {
        "release": {
          "+@version": (.tagName | sub("v", "")),
          "+@type": "stable",
          "+@date": (.publishedAt),
          "url": .url,
          "description": strenv(body)
        }
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

    # commit_hash="$(git rev-list -n 1 $release_tag)"
    # logparam "Release tag" "$release_tag" "has commit hash" "$commit_hash"

    commit_hash="$(git rev-parse origin-gio/develop)"
    logparam "Develop head (w/ metadata) has commit hash" "$commit_hash"

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

# start live server in another window if it's not running already
ensure-server:
    #!/bin/bash
    curl http://localhost:8080 >/dev/null \
      || xterm -e bash -c "make serve" \
      || mintty -e bash -c "make serve"

# Build and publish


litepack:
    #!/bin/bash
    (cd .. && ./litepack.sh)

litepack-mods:
    #!/bin/bash
    (
        set -eu -o pipefail
        cd ..
        source ./litepack.sh

        copyImods &
        fixOB &
        copyMods &
        wait
    )

# build and upload webapp to prod
publish-webapp:
    #!/bin/bash
    rm build/webAppModTrees.json || :
    rsync -ri src/imods "../Asset Pack V2/archive/"

    just litepack-mods; # just litepack for full resource verification
    make webapp

    just upload-webapp

upload-webapp:
    #!/bin/bash
    chmod -R 755 dist
    rsync -ri --exclude "*.json" --exclude "unofficial-homestuck-collection" --delete-after dist/ "homestuck.giovanh.com:~/www-homestuck/"
    # (cd ../webpage/ && make all)
    chmod -R 755 ../webpage/
    rsync -ri --delete-after ../webpage/build/ "homestuck.giovanh.com:~/www-homestuck-static/unofficial-homestuck-collection/"
    # rsync -i /cygdrive/l/Archive/Homestuck/tagly/tagly.py blog.giovanh.com:~/tagly/ --exclude '.git' --exclude '__pycache__' --exclude '.pytest_cache'
    # ssh -t blog.giovanh.com "sudo service tagbooru restart"
    :
