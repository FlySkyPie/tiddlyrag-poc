import type { NodeDetails } from 'mistreevous';
import type { Delta } from 'jsondiffpatch';

import type { Entity } from '../../../core/entity-component/entities';

import type { StartTraversalDto } from '../dto/start-traversal.dto';

export interface IAgentBridgeServer2Client {
  /**
   * Send initial BT state.
   */
  btInit(value: NodeDetails): void;

  /**
   * Send patch of BT state.
   */
  btUpdated(patch?: Delta): void;

  entityAdded(entity: Entity): void;
  entityRemoved(entity: Entity): void;
  entityUpdated(entity: Entity): void;
}

export interface IAgentBridgeClient2Server {
  start(value: StartTraversalDto): void;
}
