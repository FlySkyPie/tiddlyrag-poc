import type { IWorldProvider } from '../../../entity-component/interfaces/world-provider';

import type { CheckableConditionNode } from '../../interfaces/checkable-condition-node';

/**
 * Check if existing not explored folders.
 */
export class IsExplorableNode implements CheckableConditionNode {
  constructor(private readonly worldProvider: IWorldProvider) {}

  check(): boolean {
    const { unExploredFolders } = this.worldProvider;
    for (const _ of unExploredFolders) {
      return true;
    }
    return false;
  }
}
