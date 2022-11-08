REGISTRY_PATH ?=harbor.sun-asterisk.vn/jfs
TAG ?=latest

LARAVEL_IMAGE=$(REGISTRY_PATH)/laravel-app
WEB_SERVER_IMAGE=$(REGISTRY_PATH)/web-server
API_SERVER_IMAGE=$(REGISTRY_PATH)/api-server
CLI_IMAGE=$(REGISTRY_PATH)/cli
WEB_BUILD_IMAGE=$(REGISTRY_PATH)/web-build

build: web-build laravel web-server api-server cli

.PHONY: deploy

web-build:
	docker build ./web \
		-f docker/web-build/Dockerfile \
		-t $(WEB_BUILD_IMAGE):$(TAG) \
		--build-arg APP_URL=$(APP_URL) \
		--build-arg APP_ENV=$(APP_ENV) \
		--build-arg SERVER_API_URL=$(SERVER_API_URL) \
		--build-arg BROWSER_API_URL=$(BROWSER_API_URL) \
		--build-arg IMAGE_URL=$(IMAGE_URL) \
		--build-arg SENTRY_DSN=$(SENTRY_DSN) \
		--build-arg MIX_GA_ID=$(MIX_GA_ID) \
		--cache-from $(WEB_BUILD_IMAGE):$(TAG)

laravel:
	docker build ./api \
		-f docker/laravel-app/Dockerfile \
		-t $(LARAVEL_IMAGE):$(TAG) \
		--cache-from $(LARAVEL_IMAGE):$(TAG)

web-server:
	docker build ./web \
		-f docker/web-server/Dockerfile \
		-t $(WEB_SERVER_IMAGE):$(TAG) \
		--build-arg REGISTRY_PATH=$(REGISTRY_PATH) \
		--build-arg TAG=$(TAG) \
		--cache-from $(LARAVEL_IMAGE):$(TAG) \
		--cache-from $(WEB_SERVER_IMAGE):$(TAG)

api-server:
	docker build ./docker/api-server \
		-t $(API_SERVER_IMAGE):$(TAG) \
		--build-arg REGISTRY_PATH=$(REGISTRY_PATH) \
		--build-arg TAG=$(TAG) \
		--cache-from $(API_SERVER_IMAGE):$(TAG)

cli:
	docker build ./docker/cli \
		-t $(CLI_IMAGE):$(TAG) \
		--build-arg REGISTRY_PATH=$(REGISTRY_PATH) \
		--build-arg TAG=$(TAG) \
		--cache-from $(LARAVEL_IMAGE):$(TAG) \
		--cache-from $(CLI_IMAGE):$(TAG)

release:
	docker push $(WEB_BUILD_IMAGE):$(TAG)
	docker push $(LARAVEL_IMAGE):$(TAG)
	docker push $(WEB_SERVER_IMAGE):$(TAG)
	docker push $(API_SERVER_IMAGE):$(TAG)
	docker push $(CLI_IMAGE):$(TAG)
ifdef UNIQUE_TAG
	docker tag $(WEB_SERVER_IMAGE):$(TAG) $(WEB_SERVER_IMAGE):$(UNIQUE_TAG)
	docker push $(WEB_SERVER_IMAGE):$(UNIQUE_TAG)
	docker tag $(API_SERVER_IMAGE):$(TAG) $(API_SERVER_IMAGE):$(UNIQUE_TAG)
	docker push $(API_SERVER_IMAGE):$(UNIQUE_TAG)
	docker tag $(CLI_IMAGE):$(TAG) $(CLI_IMAGE):$(UNIQUE_TAG)
	docker push $(CLI_IMAGE):$(UNIQUE_TAG)
endif

pull:
	docker pull $(WEB_BUILD_IMAGE):$(TAG) || true
	docker pull $(LARAVEL_IMAGE):$(TAG) || true
	docker pull $(WEB_SERVER_IMAGE):$(TAG) || true
	docker pull $(API_SERVER_IMAGE):$(TAG) || true
	docker pull $(CLI_IMAGE):$(TAG) || true

clean:
	#Remove image
	docker images -q $(WEB_BUILD_IMAGE):$(TAG) | xargs -r docker rmi -f
	docker images -q $(LARAVEL_IMAGE):$(TAG) | xargs -r docker rmi -f
	docker images -q $(WEB_SERVER_IMAGE):$(TAG) | xargs -r docker rmi -f
	docker images -q $(API_SERVER_IMAGE):$(TAG) | xargs -r docker rmi -f
	docker images -q $(CLI_IMAGE):$(TAG) | xargs -r docker rmi -f

STAGE ?= ""
FORCE ?= "false"

run-playbook:
	@FORCE=$(FORCE) ./deploy/deploy $(STAGE) $(PLAYBOOK)

deploy-init:
	@cp deploy/values.example.yml deploy/values.$(STAGE).yml

deploy-setup: PLAYBOOK=provision-cluster.yml

deploy-app: PLAYBOOK=deploy-stacks.yml

deploy-update: PLAYBOOK=update-app.yml

deploy-setup deploy-app deploy-update: run-playbook
