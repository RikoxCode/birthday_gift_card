.PHONY: build run clean

build:
	docker build -t angular-birthday . --no-cache --progress=plain

run: build
	docker run --rm -d -p 8080:80 angular-birthday

clean:
	docker stop angular-birthday || true