CONFIG_JSON_PATH = "${APPDATA}/unofficial-homestuck-collection/config.json"

default: test

# We do actually use a dummy install file to track this
install: package.json yarn.lock
	yarn install --ignore-optional
	touch install

clean:
	-rm ./install src/imods.tar.gz
	-rm -r node_modules/.cache/
	-rm -r dist/ dist_electron/*/

lint: install 
	yarn run vue-cli-service lint
	# yarn lint

# Run 'SERVE_FLAGS="--reset-last-version" make src/imods.tar.gz test' to make imods and pass --reset-last-version through
test: install src/imods.tar.gz
	yarn run vue-cli-service electron:serve $(SERVE_FLAGS)
	# yarn dev

build: install src/imods.tar.gz
	yarn run vue-cli-service electron:build
	# yarn electron:build

publish_release: install src/imods.tar.gz
	yarn run vue-cli-service electron:build -p always
	
vuebuild: install src/imods.tar.gz
	yarn run vue-cli-service build

src/imods.tar.gz: $(wildcard src/imods/*) $(wildcard src/imods/*/*)
	# cd src && tar -czf imods.tar.gz imods/
	cd src && tar -cf - imods/ | gzip -9 - > imods.tar.gz
# 	-jq '.appVersion = "2.0.0"' ${CONFIG_JSON_PATH} > ${CONFIG_JSON_PATH}.tmp
# 	-mv ${CONFIG_JSON_PATH}.tmp ${CONFIG_JSON_PATH}

help:
	@echo 'Usage:'
	@echo '  make clean      try to clean old build artifacts'
	@echo '  make test       start a development version now'
	@echo '  make build      create a production version'
	@echo '  make lint       lints and fixes files'
	
	
.PHONY: clean test build publish help lint test