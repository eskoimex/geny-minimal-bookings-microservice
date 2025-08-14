import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { QueueModule } from './queue/queue.module';
import { HealthModule } from './health/health.module';
import { SocketsModule } from './socket/sockets.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, AuthModule, QueueModule, SocketsModule, BookingsModule, HealthModule,
  ],
})
export class AppModule {}
