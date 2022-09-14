name=dev

start:
	npm run watch

deploy:
	cdk deploy

install-and-deploy:
	@npm i -g aws-cdk@2.41.0
	@npm install
	cdk deploy --require-approval never -v

install:
	@npm i -g aws-cdk@2.41.0
	@npm install