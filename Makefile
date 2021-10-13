default: test

install: package.json
# 	yarn install

clean:
	rm -r src/imods.tar
	
lint: install 
	yarn lint

src/imods.tar: $(wildcard src/imods/*)
	pushd src
	tar -czf imods.tar imods/
	popd
	
test: install src/imods.tar
	yarn dev

publish: install src/imods.tar
	yarn electron:build

	
help:
	@echo 'Usage:                         '
	@echo '  make clean      try to clean old build artifacts'
	@echo '  make test       start a development version now'
	@echo '  make publish    create a production version'
	@echo '  make lint       lints and fixes files'
	
	
.PHONY: clean test publish help lint test