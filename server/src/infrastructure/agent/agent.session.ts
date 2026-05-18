import type { Socket } from 'socket.io';
import type { NodeDetails } from 'mistreevous';
import { BehaviourTree } from 'mistreevous';
import { diff } from 'jsondiffpatch';

import type { Entity } from '../../core/entity-component/entities';
import type { IGiteaRepository } from '../../core/repository/gitea.repository';
import { IsExplorableNode } from '../../core/behavior-tree/node/conditions/is-explorable';
import { ExplodeFolderDepthlyNode } from '../../core/behavior-tree/node/actions/explode-folder-depthly';
import { ExplodeFolderWidelyNode } from '../../core/behavior-tree/node/actions/explode-folder-widely';

import { NodesAdapter } from '../behavior-tree/adapter/nodes-adapter';
import { WorldAdapter } from '../world/adapter/world-adapter';

import type {
  IAgentBridgeServer2Client as EmitEvents,
  IAgentBridgeClient2Server as ListenEvents,
} from './interfaces/agent-bridge';
import type { StartTraversalDto } from './dto/start-traversal.dto';

export class AgentSession {
  private behaviourTree: BehaviourTree | null;

  private latestTree: NodeDetails;

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
    this.worldAdapter
      .on('entity-added', this.handleEntityAdded)
      .on('entity-removed', this.handleEntityRemoved)
      .on('entity-updated', this.handleEntityUpdated);

    nodesAdapter
      .registerCondition(
        'IsExplorable',
        new IsExplorableNode(this.worldAdapter),
      )
      .registerAction(
        'ExplodeFolderDepthly',
        new ExplodeFolderDepthlyNode(this.worldAdapter, this.giteaRepository),
      )
      .registerAction(
        'ExplodeFolderWidely',
        new ExplodeFolderWidelyNode(this.worldAdapter, this.giteaRepository),
      );

    this.behaviourTree = new BehaviourTree(definition, nodesAdapter.nodes);

    this.latestTree = this.behaviourTree.getTreeNodeDetails();
    socket.emit('btInit', this.latestTree);

    this.start();
  }

  public start() {
    const doTick = () => {
      if (!this.behaviourTree) {
        return;
      }
      this.behaviourTree.step();

      const previous = this.latestTree;
      this.latestTree = this.behaviourTree.getTreeNodeDetails();
      const delta = diff(previous, this.latestTree);
      if (delta) {
        this.socket.emit('btUpdated', delta);
      }

      this.timer = setTimeout(doTick, 100);
    };

    this.timer = setTimeout(doTick, 100);
  }

  public dispose() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.behaviourTree = null;
    this.worldAdapter.dispose();
  }

  public createTraversalRoot({ owner, repo }: StartTraversalDto) {
    this.worldAdapter.addEntity({
      owner,
      repo,
      fsPath: '.',
      fsName: '.',
      name: '.',
      fsSize: 0,
      isFsDir: true,
      isExplored: undefined,
    });
  }

  private handleEntityAdded = (entity: Entity) => {
    this.socket.emit('entityAdded', entity);
  };

  private handleEntityRemoved = (entity: Entity) => {
    this.socket.emit('entityRemoved', entity);
  };

  private handleEntityUpdated = (entity: Entity) => {
    this.socket.emit('entityUpdated', entity);
  };
}
