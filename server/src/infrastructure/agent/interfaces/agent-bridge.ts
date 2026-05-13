import type { NodeDetails } from 'mistreevous';

import type { StartTraversalDto } from '../dto/start-traversal.dto';

export interface IAgentBridgeServer2Client {
  updateDetail(value: NodeDetails): void;
}

export interface IAgentBridgeClient2Server {
  start(value: StartTraversalDto): void;
}
