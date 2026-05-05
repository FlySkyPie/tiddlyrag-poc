export default () => ({
  openai: {
    embedding: {
      model: process.env.EMBEDDING_MODEL,
      api_base: process.env.EMBEDDING_BASE_PATH,
      api_key: process.env.EMBEDDING_API_KEY,
    },
  },
});
