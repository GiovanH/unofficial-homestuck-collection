default: test

install: package.json
	yarn install
	touch install

clean:
	rm -r src/imods.tar

lint: install 
	yarn run vue-cli-service lint
	# yarn lint
	
test: install src/imods.tar
	yarn run vue-cli-service electron:serve
	# yarn dev

publish: install src/imods.tar
	yarn run vue-cli-service electron:build
	# yarn electron:build
	
vuebuild: install 
	yarn run vue-cli-service build

src/imods.tar: $(wildcard src/imods/*)
	cd src && tar -czf imods.tar imods/

	
help:
	@echo 'Usage:                         '
	@echo '  make clean      try to clean old build artifacts'
	@echo '  make test       start a development version now'
	@echo '  make publish    create a production version'
	@echo '  make lint       lints and fixes files'
	
	
.PHONY: clean test publish help lint test