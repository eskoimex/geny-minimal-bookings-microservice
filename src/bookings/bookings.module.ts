import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsRepository } from './bookings.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { QueueModule } from '../queue/queue.module';
import { SocketsModule } from '../socket/sockets.module';
import { BookingsGrpcController } from './bookings.grpc.controller';

@Module({
  imports: [PrismaModule, QueueModule, SocketsModule],
  controllers: [BookingsController, BookingsGrpcController],
  providers: [BookingsService, BookingsRepository],
  exports: [BookingsService],
})
export class BookingsModule {}
