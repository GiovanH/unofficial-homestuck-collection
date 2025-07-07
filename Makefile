-include .env

CONFIG_JSON_PATH = "${APPDATA}/unofficial-homestuck-collection/config.json"

.SECONDEXPANSION:
.SUFFIXES:

default: test

## Setup

# We do actually use a dummy install file to track this
yarn.lock: package.json
	yarn install # --ignore-optional
	touch yarn.lock

install: package.json yarn.lock
	yarn install
	touch install

## Prep actions

.PHONY: clean
clean:
	yarn cache clean
	-rm yarn-error.log
	-rm ./install src/imods.tar.gz
	-rm -r node_modules/.cache/
	-rm -r dist/ dist_electron/* dist_electron/*/

.PHONY: lint
lint: install
	yarn run vue-cli-service lint
	# yarn lint

## Intermediate files

SHARED_INTERMEDIATE=src/imods.tar.gz src/js/crc_imods.json

src/imods.tar.gz: $(wildcard src/imods/*) $(wildcard src/imods/*/*)
	# cd src && tar -czf imods.tar.gz imods/
	cd src && tar -cf - imods/ | gzip -9 - > imods.tar.gz
# 	-jq '.appVersion = "2.0.0"' ${CONFIG_JSON_PATH} > ${CONFIG_JSON_PATH}.tmp
# 	-mv ${CONFIG_JSON_PATH}.tmp ${CONFIG_JSON_PATH}

src/js/crc_imods.json: src/imods.tar.gz
	yarn exec node src/js/validation.js src/imods/ src/js/crc_imods.json

WEBAPP_INTERMEDIATE=build/webAppModTrees.json webapp/browser.js

build/webAppModTrees.json: webapp/browser.js.j2
	mkdir -p build/
	(cd ${ASSET_DIR_LITE}; tree archive/imods mods -J | jq '. | walk(if type == "object" then (if .type == "file" then ({"key": (.name), "value": true}) elif has("contents") then {"key": (.name), "value": .contents|from_entries} else . end) else . end) | .[:-1] | from_entries') > build/webAppModTrees.json

webapp/browser.js: webapp/browser.js.j2
	env ASSET_DIR="${ASSET_DIR_LITE}" \
		ASSET_PACK_HREF="http://localhost:8413/" \
		APP_VERSION=`jq -r '.version' < package.json` \
		jinja2 $< > $@

# src/js/crc_pack.json:
# 	yarn exec node src/js/validation.js "${ASSET_DIR}" src/js/crc_pack.json

## Running live

# Run 'rm src/imods.tar.gz; SERVE_FLAGS="--reset-last-version" make src/imods.tar.gz test' to make imods and pass --reset-last-version through
.PHONY: test
test: install ${SHARED_INTERMEDIATE}
	yarn run vue-cli-service electron:serve $(SERVE_FLAGS)

.PHONY: itest
itest:
	-rm src/imods.tar.gz
	SERVE_FLAGS="--reset-last-version" make src/imods.tar.gz test

.PHONY: ensure-asset-server
ensure-asset-server:
	curl http://localhost:8413 >/dev/null \
	  || mintty --hold error -e bash -c 'ROOT_DIR="${ASSET_DIR_LITE}" python3 webapp/httpserver.py' &

.PHONY: serve
serve: install ${SHARED_INTERMEDIATE} ${WEBAPP_INTERMEDIATE}
	make ensure-asset-server
	env ASSET_PACK_HREF="http://localhost:8413/" yarn run vue-cli-service serve webapp/browser.js &
	react "make webapp/browser.js" webapp/browser.js.j2

## Building output

.PHONY: build
build: install ${SHARED_INTERMEDIATE}
	env NODE_OPTIONS=--max_old_space_size=8192 \
		yarn run vue-cli-service electron:build

.PHONY: publish-release
publish-release: install ${SHARED_INTERMEDIATE}
	env NODE_OPTIONS=--max_old_space_size=8192 \
		yarn run vue-cli-service electron:build -p always
	# Don't bundle non-unified NSIS builds
	-rm dist_electron/*-win-ia32.exe
	-rm dist_electron/*-win-x64.exe

.PHONY: webapp
webapp: install ${SHARED_INTERMEDIATE} ${WEBAPP_INTERMEDIATE} 
	env ASSET_PACK_HREF="https://filedn.com/lANSiYhDVpD4ou6Gt17Ij9m/AssetPackV2Lite/" \
		yarn run vue-cli-service build webapp/browser.js

.PHONY: help
help:
	grep -E '(^[^.#[:space:]].*:)|(##)' Makefile
