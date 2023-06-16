include .env

CONFIG_JSON_PATH = "${APPDATA}/unofficial-homestuck-collection/config.json"

default: test

# We do actually use a dummy install file to track this
install: package.json yarn.lock
	yarn install --ignore-optional
	touch install

clean:
	-rm ./install src/imods.tar
	-rm -r dist/ dist_electron/*/

lint: install 
	yarn run vue-cli-service lint
	# yarn lint

# Run 'SERVE_FLAGS="--reset-last-version" make src/imods.tar test' to make imods and pass --reset-last-version through
test: install src/imods.tar
	yarn run vue-cli-service electron:serve $(SERVE_FLAGS)
	# yarn dev

webapp: install webAppModTrees.json
	env ASSET_DIR=${ASSET_DIR} \
		ASSET_PACK_HREF=${ASSET_PACK_HREF} \
		j2 webapp/browser.js.j2
	yarn run vue-cli-service build webapp/browser.js

serve: install webAppModTrees.json
	env ASSET_DIR=${ASSET_DIR} \
		ASSET_PACK_HREF="http://localhost:8413/" \
		j2 webapp/browser.js.j2
# 	(react webapp/browser.js.j2 env ASSET_DIR=${ASSET_DIR} \
# 		ASSET_PACK_HREF="http://localhost:8413/" \
# 		j2 webapp/browser.js.j2) &
	(cd ${ASSET_DIR}; python3 "L:/Archive/Homestuck/TUHC/unofficial-homestuck-collection/webapp/httpserver.py") &
	env ASSET_PACK_HREF="http://localhost:8413/" yarn run vue-cli-service serve webapp/browser.js

webAppModTrees.json:
	(cd ${ASSET_DIR}; tree archive/imods mods -J | jq '. | walk(if type == "object" then (if .type == "file" then ({"key": (.name), "value": true}) elif has("contents") then {"key": (.name), "value": .contents|from_entries} else . end) else . end) | .[:-1] | from_entries') > webAppModTrees.json

build: install src/imods.tar
	yarn run vue-cli-service electron:build
	# yarn electron:build

publish_release: install src/imods.tar
	yarn run vue-cli-service electron:build -p always
	
vuebuild: install src/imods.tar
	yarn run vue-cli-service build

src/imods.tar: $(wildcard src/imods/*) $(wildcard src/imods/*/*)
	cd src && tar -czf imods.tar imods/
# 	-jq '.appVersion = "2.0.0"' ${CONFIG_JSON_PATH} > ${CONFIG_JSON_PATH}.tmp
# 	-mv ${CONFIG_JSON_PATH}.tmp ${CONFIG_JSON_PATH}

help:
	@echo 'Usage:'
	@echo '  make clean      try to clean old build artifacts'
	@echo '  make test       start a development version now'
	@echo '  make build      create a production version'
	@echo '  make lint       lints and fixes files'
	
	
.PHONY: clean test build publish help lint test webapp