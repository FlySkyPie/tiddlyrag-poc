import type { Socket } from 'socket.io';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

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
    this.agentMap.set(socket.id, new AgentSession());

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

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}
