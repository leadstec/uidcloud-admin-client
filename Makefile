ci: test
	npm run docs

test: lint
	npm test
	npm run dependencyCheck

lint: node_modules
	npm run lint

cleanup:
	rm -rf node_modules coverage docs publish

node_modules: package.json
	npm install

.PHONY: node_modules
