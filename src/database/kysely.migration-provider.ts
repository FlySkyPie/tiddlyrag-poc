import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { FileMigrationProvider, Migration, MigrationProvider } from 'kysely';

export class KyselyMigrationProvider implements MigrationProvider {
  #fileProvider: FileMigrationProvider;

  constructor() {
    this.#fileProvider = new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.resolve(path.join(__dirname, './migrations')),
    });
  }

  public async getMigrations(): Promise<Record<string, Migration>> {
    return this.#fileProvider.getMigrations();
  }
}
