import type { TickableActionNode } from '../interfaces/tickable-action-node';

/**
 * Just a sample node.
 */
export class LaughNode implements TickableActionNode {
  tick(): boolean {
    console.log('Laugh');
    return false;
  }
}
