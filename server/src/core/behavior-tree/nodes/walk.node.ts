import type { IWorldProvider } from '../../entity-component/interfaces/world-provider';
import type { TickableActionNode } from '../interfaces/tickable-action-node';

/**
 * Just a sample node.
 */
export class WalkNode implements TickableActionNode {
  private readonly worldProvider: IWorldProvider;

  constructor(worldProvider: IWorldProvider) {
    this.worldProvider = worldProvider;
  }

  tick(): boolean {
    for (const { title } of this.worldProvider.withTitle) {
      console.log('Walk with', title);
    }
    return false;
  }
}
