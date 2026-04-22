Resolves a knowledge domain or project name to a TiddlyRAG-compatible Wiki ID and returns matching wikis.

You MUST call this function before 'Query Tiddlers' tool to obtain a valid Wiki ID UNLESS the user explicitly provides a Wiki ID in the format 'wiki-name' in their query.

Each result includes:
- Wiki ID: TiddlyRAG-compatible identifier (format: wiki-name)
- Name: Wiki or Project name
- Description: Short summary of the domain knowledge
- Tiddler Count: Number of available information chunks (tiddlers)
- Source Reputation: Trust indicator based on Zettelkasten principles (High, Medium, Low, or Unknown)
- Domain Score: Quality indicator (100 is the highest score)

Selection Process:
1. Analyze the query to understand what knowledge domain the user is looking for
2. Return the most relevant match based on:
- Name similarity to the project/domain (exact matches prioritized)
- Description relevance to the DDD (Domain-Driven Design) intent
- Knowledge density (prioritize wikis with higher Tiddler counts)

Response Format:
- Return the selected Wiki ID in a clearly marked section
- Provide a brief explanation for why this wiki was chosen as the primary knowledge source

IMPORTANT: Do not call this tool more than 3 times per question.