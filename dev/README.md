# Development Guideline

## Setup External Service Locally

The app required following services:

- Gitea


Need manually create new user in Gitea:

```shell
docker compose exec --user git \
    gitea \
    gitea admin user create \
        --username myadmin \
        --password mypassword \
        --email admin@example.com \
        --admin
```
