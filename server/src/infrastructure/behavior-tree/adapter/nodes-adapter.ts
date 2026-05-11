import type { Agent } from 'mistreevous/dist/Agent';
import { State } from 'mistreevous';

import type { TickableActionNode } from '../../../core/behavior-tree/interfaces/tickable-action-node';

/**
 * This using to convert Object-based Nodes into Function-based interface
 * that Mistreevous required.
 */
export class NodesAdapter {
  private _nodeMap: Record<string, () => State | Promise<State>> = {};

  get nodes(): Agent {
    return this._nodeMap;
  }

  public register(name: string, node: TickableActionNode) {
    this._nodeMap[name] = (): State | Promise<State> => {
      try {
        const result = node.tick();
        if (result === true) {
          return State.FAILED;
        }
        if (result === false) {
          return State.SUCCEEDED;
        }
        return new Promise((resolve) => {
          result
            .then((asyncResult) => {
              if (asyncResult) {
                resolve(State.FAILED);
              } else {
                resolve(State.SUCCEEDED);
              }
            })
            .catch(() => resolve(State.FAILED));
        });
      } catch (_: unknown) {
        return State.FAILED;
      }
    };

    return this;
  }
}
