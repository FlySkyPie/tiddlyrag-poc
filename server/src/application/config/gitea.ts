export default () => ({
  gitea: {
    api_base: process.env.GIT_BASE_PATH,
    user: process.env.GIT_USER,
    password: process.env.GIT_PASSWORD,
  },
});
