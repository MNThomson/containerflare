<!-- markdownlint-disable MD033 MD013 -->
<h1 align="center">
    <a href="https://github.com/MNThomson/containerflare">
        <img src="src/public/favicon.svg" alt="Containerflare Logo" width="100">
    </a>
    <br>
        ContainerFlare
    <br>
</h1>
<h4 align="center">
    Cloudflare container image repository
</h4>
<p align="center">
    <a href="https://github.com/MNThomson/containerflare/commits">
        <img
            src="https://img.shields.io/github/last-commit/MNThomson/containerflare?style=for-the-badge"
            alt="Last GitHub Commit"
        >
    </a>
</p>
<!-- markdownlint-enable -->

---

<!-- markdownlint-disable-next-line MD002 -->

## About

A globally distributed, edge container image registry that leverages the power of Cloudflare's global network. Providing `docker pull`'s 3x faster than DockerHub, Containerflare offers a unique solution for developers looking to distribute their container images worldwide efficiently.

## Features

- **Global Distribution**: Utilize Cloudflare's vast network to pull container images from the edge, closest to where they are needed
- **High Performance**: Experience speeds up to 3x faster than DockerHub, reducing the time it takes to download and deploy container images
- **Built with Astro**: Containerflare is developed using the Astro web framework, ensuring a modern and efficient web application
- **Cloudflare Pages Hosting**: By being hosted on Cloudflare Pages, Containerflare benefits from the additional speed and reliability inherent to the platform

## Demo

Use the publicly hosted instance at [cfcr.dev](https://cfcr.dev):

```console
docker pull cfcr.dev/hello-world
```

## Development

Containerflare can be run locally for either further development or customization.

> [!NOTE]
> **BEFORE** you run the following steps make sure:
> - You have Node installed locally on you machine
> - You have `docker` & `docker-compose` installed and running

```shell
# Clone the repository
git clone https://github.com/MNThomson/containerflare.git && cd containerflare

# To start developing, run containerflare
npm start
```

The development environment is now running and accesible at https://localhost:4321/

To benchmark the implementation:

```shell
# Build the empty container (so there is no docker cache effecting results)
cd dev && make build

# Run the empty container
make run

# Within the container shell run the command to pull from the locally running containerflare instance
pull
```
