import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({ namespace: '/bookings', cors: true })

export class SocketsGateway {
  @WebSocketServer() server!: Server;
  emitBookingCreated(booking: any) { this.server.emit('booking.created', booking); }
  emitBookingReminder(payload: any) { this.server.emit('booking.reminder', payload); }
}
