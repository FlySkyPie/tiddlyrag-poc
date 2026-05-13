import type { Socket } from 'socket.io';
import { BehaviourTree } from 'mistreevous';

import type { IGiteaRepository } from '../../core/repository/gitea.repository';
import { FallNode } from '../../core/behavior-tree/nodes/fall.node';
import { LaughNode } from '../../core/behavior-tree/nodes/laugh.node';
import { WalkNode } from '../../core/behavior-tree/nodes/walk.node';
import { IsExplorableNode } from '../../core/behavior-tree/node/conditions/is-explorable';
import { ExplodeFolderDepthlyNode } from '../../core/behavior-tree/node/actions/explode-folder-depthly';

import { NodesAdapter } from '../behavior-tree/adapter/nodes-adapter';
import { WorldAdapter } from '../world/adapter/world-adapter';

import type {
  IAgentBridgeServer2Client as EmitEvents,
  IAgentBridgeClient2Server as ListenEvents,
} from './interfaces/agent-bridge';
import type { StartTraversalDto } from './dto/start-traversal.dto';

export class AgentSession {
  private behaviourTree: BehaviourTree | null;

  private timer: NodeJS.Timeout | null = null;

  private worldAdapter: WorldAdapter;

  constructor(
    private readonly socket: Socket<ListenEvents, EmitEvents>,
    private readonly giteaRepository: IGiteaRepository,
  ) {
    const definition = `root {
    sequence {
        condition [IsExplorable]
        action [ExplodeFolderDepthly]
    }
}`;

    const nodesAdapter = new NodesAdapter();
    this.worldAdapter = new WorldAdapter();

    nodesAdapter
      .registerCondition(
        'IsExplorable',
        new IsExplorableNode(this.worldAdapter),
      )
      .registerAction(
        'ExplodeFolderDepthly',
        new ExplodeFolderDepthlyNode(this.worldAdapter, this.giteaRepository),
      )
      .registerAction('Walk', new WalkNode(this.worldAdapter))
      .registerAction('Fall', new FallNode())
      .registerAction('Laugh', new LaughNode());

    this.behaviourTree = new BehaviourTree(definition, nodesAdapter.nodes);

    this.start();
  }

  public start() {
    this.timer = setInterval(() => {
      if (!this.behaviourTree) {
        return;
      }
      this.behaviourTree.step();
      this.socket.emit('updateDetail', this.behaviourTree.getTreeNodeDetails());
    }, 100);
  }

  public dispose() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.behaviourTree = null;
  }

  public createTraversalRoot({ owner, repo }: StartTraversalDto) {
    this.worldAdapter.addEntity({
      owner,
      repo,
      fsPath: '.',
      fsName: '.',
      fsSize: 0,
      isFsDir: true,
      isExplored: undefined,
    });
  }
}
