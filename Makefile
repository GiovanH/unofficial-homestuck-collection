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

.PHONY: lint
lint: install
	yarn run vue-cli-service lint
	# yarn lint

## Intermediate files

src/imods.tar.gz: $(wildcard src/imods/*) $(wildcard src/imods/*/*)
	# cd src && tar -czf imods.tar.gz imods/
	cd src && tar -cf - imods/ | gzip -9 - > imods.tar.gz
# 	-jq '.appVersion = "2.0.0"' ${CONFIG_JSON_PATH} > ${CONFIG_JSON_PATH}.tmp
# 	-mv ${CONFIG_JSON_PATH}.tmp ${CONFIG_JSON_PATH}

## Running live

# Run 'rm src/imods.tar.gz; SERVE_FLAGS="--reset-last-version" make src/imods.tar.gz test' to make imods and pass --reset-last-version through
.PHONY: test
test: install src/imods.tar.gz
	yarn run vue-cli-service electron:serve $(SERVE_FLAGS)
	# yarn dev

.PHONY: itest
itest:
	-rm src/imods.tar.gz
	SERVE_FLAGS="--reset-last-version" make src/imods.tar.gz test

## Building output

.PHONY: build
build: install src/imods.tar.gz
	yarn run vue-cli-service electron:build
	# yarn electron:build

.PHONY: publish-release
publish-release: install src/imods.tar.gz
	yarn run vue-cli-service electron:build -p always

.PHONY: help
help:
	grep -E '(^[^.#[:space:]].*:)|(##)' Makefile
