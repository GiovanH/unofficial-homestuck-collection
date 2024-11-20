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
	-rm -r dist/ dist_electron/*/
	-rm build/webAppModTrees.json

.PHONY: lint
lint: install
	yarn run vue-cli-service lint
	# yarn lint

## Intermediate files

build/webAppModTrees.json: webapp/browser.js.j2
	mkdir -p build/
	(cd ${ASSET_DIR}; tree archive/imods mods -J | jq '. | walk(if type == "object" then (if .type == "file" then ({"key": (.name), "value": true}) elif has("contents") then {"key": (.name), "value": .contents|from_entries} else . end) else . end) | .[:-1] | from_entries') > build/webAppModTrees.json

src/imods.tar.gz: $(wildcard src/imods/*) $(wildcard src/imods/*/*)
	# cd src && tar -czf imods.tar.gz imods/
	cd src && tar -cf - imods/ | gzip -9 - > imods.tar.gz
# 	-jq '.appVersion = "2.0.0"' ${CONFIG_JSON_PATH} > ${CONFIG_JSON_PATH}.tmp
# 	-mv ${CONFIG_JSON_PATH}.tmp ${CONFIG_JSON_PATH}

# Note: browser.js is not a determinate intermediate file because it depends on parameters!

## Running live

# Run 'rm src/imods.tar.gz; SERVE_FLAGS="--reset-last-version" make src/imods.tar.gz test' to make imods and pass --reset-last-version through
.PHONY: test
test: install src/imods.tar.gz
	yarn run vue-cli-service electron:serve $(SERVE_FLAGS)

.PHONY: serve
serve: install src/imods.tar.gz build/webAppModTrees.json
	(cd ${ASSET_DIR} && python3 "L:/Archive/Homestuck/TUHC/unofficial-homestuck-collection/webapp/httpserver.py") &
	env ASSET_PACK_HREF="http://localhost:8413/" yarn run vue-cli-service serve webapp/browser.js &
	react webapp/browser.js.j2 \
		env ASSET_DIR=${ASSET_DIR} \
			ASSET_PACK_HREF="http://localhost:8413/" \
			APP_VERSION=`jq -r '.version' < package.json` \
			j2 webapp/browser.js.j2

.PHONY: itest
itest:
	-rm src/imods.tar.gz
	SERVE_FLAGS="--reset-last-version" make src/imods.tar.gz test

## Building output

.PHONY: build
build: install src/imods.tar.gz
	yarn run vue-cli-service electron:build
	# yarn electron:build

.PHONY: webapp
webapp: install build/webAppModTrees.json
# 	cp .env_webbuild .env
	env ASSET_DIR=${ASSET_DIR} \
		ASSET_PACK_HREF="https://filedn.com/lANSiYhDVpD4ou6Gt17Ij9m/AssetPackV2Lite/" \
		APP_VERSION=`jq -r '.version' < package.json` \
		j2 webapp/browser.js.j2
	env ASSET_PACK_HREF="https://filedn.com/lANSiYhDVpD4ou6Gt17Ij9m/AssetPackV2Lite/" \
		yarn run vue-cli-service build webapp/browser.js

.PHONY: publish-release
publish-release: install src/imods.tar.gz
	yarn run vue-cli-service electron:build -p always

.PHONY: help
help:
	grep -E '(^[^.#[:space:]].*:)|(##)' Makefile
