import type { Agent } from 'mistreevous/dist/Agent';
import { State } from 'mistreevous';

import type { TickableActionNode } from '../../../core/behavior-tree/interfaces/tickable-action-node';
import type { CheckableConditionNode } from 'src/core/behavior-tree/interfaces/checkable-condition-node';

/**
 * This using to convert Object-based Nodes into Function-based interface
 * that Mistreevous required.
 */
export class NodesAdapter {
  private _nodeMap: Record<string, () => State | Promise<State> | boolean> = {};

  private _nameSet: Set<string> = new Set();

  get nodes(): Agent {
    return this._nodeMap;
  }

  public registerAction(name: string, node: TickableActionNode) {
    const isExisting = this._nameSet.has(name);
    if (isExisting) {
      console.warn(
        `The Node name '${name}' already been taken, the operate is skipped.`,
      );
      return this;
    }
    this._nameSet.add(name);
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

  public registerCondition(name: string, node: CheckableConditionNode) {
    const isExisting = this._nameSet.has(name);
    if (isExisting) {
      console.warn(
        `The Node name '${name}' already been taken, the operate is skipped.`,
      );
      return this;
    }
    this._nameSet.add(name);

    this._nodeMap[name] = (): boolean => {
      try {
        return node.check();
      } catch (error: unknown) {
        console.error(
          `Error occored in condition node "${name}": ${String(error)}`,
        );
        return false;
      }
    };

    return this;
  }
}
