import { resolve } from 'node:path';

export default () => ({
  tiddlywiki: {
    template:
      process.env.TIDDLYWIKI_TEMPLATE_PATH ||
      resolve(__dirname, '../../tiddlywiki-template/base'),
  },
});
