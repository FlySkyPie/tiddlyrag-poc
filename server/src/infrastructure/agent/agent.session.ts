import { BehaviourTree } from 'mistreevous';

import { FallNode } from 'src/core/behavior-tree/nodes/fall.node';
import { LaughNode } from 'src/core/behavior-tree/nodes/laugh.node';
import { WalkNode } from 'src/core/behavior-tree/nodes/walk.node';
import { NodesAdapter } from '../behavior-tree/adapter/nodes-adapter';
import { WorldAdapter } from '../world/adapter/world-adapter';

export class AgentSession {
  private behaviourTree: BehaviourTree | null;

  private timer: NodeJS.Timeout | null = null;

  constructor() {
    const definition = `root {
    sequence {
        action [Walk]
        wait [1000]
        action [Fall]
        wait [1000]
        action [Laugh]
    }
}`;

    const nodesAdapter = new NodesAdapter();
    const worldAdapter = new WorldAdapter();

    worldAdapter.addEntity({ title: 'Sample' });

    nodesAdapter
      .register('Walk', new WalkNode(worldAdapter))
      .register('Fall', new FallNode())
      .register('Laugh', new LaughNode());

    this.behaviourTree = new BehaviourTree(definition, nodesAdapter.nodes);

    this.start();
  }

  public start() {
    this.timer = setInterval(() => {
      this.behaviourTree?.step();
      //   console.log('Tree:', this.behaviourTree.getState());
    }, 100);
  }

  public dispose() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.behaviourTree = null;
  }
}
