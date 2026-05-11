export default () => ({
  openai: {
    embedding: {
      model: process.env.EMBEDDING_MODEL,
      api_base: process.env.EMBEDDING_BASE_PATH,
      api_key: process.env.EMBEDDING_API_KEY,
    },
    common_llm: {
      model: process.env.COMMON_LLM_MODEL,
      api_base: process.env.COMMON_LLM_BASE_PATH,
      api_key: process.env.COMMON_LLM_API_KEY,
    },
  },
});
