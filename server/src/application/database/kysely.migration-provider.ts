import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { Injectable } from '@nestjs/common';
import { FileMigrationProvider, Migration, MigrationProvider } from 'kysely';

@Injectable()
export class KyselyMigrationProvider implements MigrationProvider {
  #fileProvider: FileMigrationProvider;

  constructor() {
    this.#fileProvider = new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.resolve(path.join(__dirname, './migrations')),
    });
  }

  public async getMigrations(): Promise<Record<string, Migration>> {
    return this.#fileProvider.getMigrations();
  }
}
