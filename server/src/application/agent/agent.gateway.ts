import type { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import type { StartTraversalDto } from '../../infrastructure/agent/dto/start-traversal.dto';
import { AgentSession } from '../../infrastructure/agent/agent.session';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AgentGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private agentMap: Map<string, AgentSession> = new Map();

  constructor() {}

  handleConnection(socket: Socket) {
    this.agentMap.set(socket.id, new AgentSession(socket));

    console.log(`Client ${socket.id} is connected.`);
  }

  handleDisconnect(socket: Socket) {
    const agent = this.agentMap.get(socket.id);
    if (agent) {
      agent.dispose();
    }
    this.agentMap.delete(socket.id);
    console.log(`Client ${socket.id} disconnected.`);
  }

  @SubscribeMessage('start')
  handleStart(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: StartTraversalDto,
  ) {
    const agent = this.agentMap.get(socket.id);
    if (!agent) {
      return;
    }
    agent.createTraversalRoot(data);
  }
}
