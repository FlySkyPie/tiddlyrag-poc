<div align="center">
  <a href="https://flyskypie.github.io/tiddlyrag-planning/">
    <img src="docs/logo.svg" alt="TiddlyRAG" width="300" height="auto" />
  </a>
  <p align="center">
    <b>POC: Basic Use Case</b>
  </p>
</div>

## What's TiddlyRAG?

Please check [the planning repo](https://github.com/FlySkyPie/tiddlyrag-planning).

## What's this POC providing?

![](./docs/02_base-use-case.webp)

This POC providing a HTTP API used to upload a TiddlyWiki into database, only Tiddlers been tag as `knowledge` would been imported.

Also providing a simple MCP interface allowed you integrate with other LLM tools, the interface design is inspired by Context7.


## Usage

```yaml
services:
  tiddlyrag:
    image: ghcr.io/flyskypie/tiddlyrag-poc:type-a-0.1.0
    ports:
      - 8089:3000
    environment:
      - DATABASE_HOST=pgvector
      - DATABASE_PORT=5432
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=postgres

      - EMBEDDING_BASE_PATH=https://openrouter.ai/api/v1/embeddings
      - EMBEDDING_MODEL=qwen/qwen3-embedding-4b
      - EMBEDDING_API_KEY=

      - COMMON_LLM_MODEL=qwen/qwen3.5-27b
      - COMMON_LLM_BASE_PATH=https://openrouter.ai/api/v1
      - COMMON_LLM_API_KEY=
      
      - TIDDLYWIKI_TEMPLATE_PATH=/tiddlywiki-template
    volumes:
      - ./tiddlywiki-template:/tiddlywiki-template
```

and open http://localhost:8089/docs

### Tiddlywiki Template

You can setup plugins or tidders as base TiddlyWiki:

```
└── tiddlywiki-template
    ├── plugins
    ├── public
    ├── tiddlers
    └── tiddlywiki.info
```

This used for the endpoint `GET /wikis/{wiki}`.

## More Information

If you interesting about the idea, here are related materials, some of them are blog posts I wrote before.

- [FlySkyPie/tiddlyrag-planning](https://github.com/FlySkyPie/tiddlyrag-planning) (Mandarin)
  - The GitHub repo used for planning TiddlyRAG.
- [ODDD](https://flyskypie.github.io/microproject-wikis/oddd.html) (Mandarin)
  - A TiddlyWiki talking about ODDD (ontology-domain driven design), which a methodology would using TiddlyRAG as infrastructure.
- [2025-10-06 a idea about using tiddlywiki as llms.txt](https://flyskypie.github.io/blog/2025-10-06_a-idea-about-using-tiddlywiki-as-llmstxt/) (Manderin)
  - First pmy ublic post talking about the idea.
- [2026-04-20 Freedom is not free in LLM era](https://flyskypie.github.io/posts/2026-04-20_freeson-isnt-free-in-llm-era/) (Manderin)
  - One of philosophy of mine is what drives me to invest effort into RAG systems.
- [2026-03-17 software growing trap with vibe coding](https://flyskypie.github.io/posts/2026-03-17_software-growing-trap/) (Manderin)
  - Why create RAG to stored domain knowledge is important.
- [2025-09-09 LLM and robotic arm](https://flyskypie.github.io/posts/2025-09-09_llm-and-robot-arm/) (Manderin)
