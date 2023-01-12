run:
	docker run -d --privileged --name containerflare-dev  mnthomson/containerflare:dev
	docker exec -it containerflare-dev /bin/sh
	make kill

kill:
	docker kill containerflare-dev
	docker rm containerflare-dev

build:
	docker build -t mnthomson/containerflare:dev -f dockerfile.dev .
