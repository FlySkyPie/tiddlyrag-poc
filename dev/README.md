# Development Guideline

## Setup External Service Locally

The app required following services:

- PostgresSQL with vectors extension
- Text Embedding (through OpenAI-Compatible API)
- LLM (through OpenAI-Compatible API)

The [Docker Compose YAML](./docker-compose//docker-compose.yaml) can help you setup those service locally.

> [!TIP]
> If you have Hugging Face mirror server (such as [olah](https://github.com/FlySkyPie/olah)), set `HF_ENDPOINT` to llama.cpp service can speed up model downloading process.
>
