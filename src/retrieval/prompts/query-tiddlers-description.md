Retrieves and queries specific tiddlers (information chunks) from a TiddlyWiki knowledge base.

You must call 'Resolve TiddlyRAG Wiki ID' first to obtain the exact Wiki ID, UNLESS the user explicitly provides one in the format 'wiki-name'.

This tool performs semantic search across the non-linear notes (Zettelkasten) within the target wiki to find the most relevant context for the LLM.

IMPORTANT: Do not call this tool more than 3 times per question. If you cannot find what you need after 3 calls, use the best information available in the retrieved tiddlers.