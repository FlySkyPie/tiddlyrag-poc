import type { TickableActionNode } from '../interfaces/tickable-action-node';

/**
 * Just a sample node.
 */
export class FallNode implements TickableActionNode {
  tick(): boolean {
    console.log('Fall');
    return false;
  }
}
