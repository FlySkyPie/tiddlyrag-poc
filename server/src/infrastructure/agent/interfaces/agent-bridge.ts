import type { NodeDetails } from 'mistreevous';

export interface IAgentBridgeServer2Client {
  updateDetail(value: NodeDetails): void;
}
