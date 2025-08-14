import { Global, Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { RemindersWorker } from './reminders.worker';
import { SocketsModule } from '../socket/sockets.module';
@Global()
@Module({
  imports: [SocketsModule],
  providers: [
    { provide: 'REMINDERS_QUEUE',
      useFactory: () => {
        const url = process.env.REDIS_URL || 'redis://redis:6379';
        const connection = new IORedis(url) as any;
        return new Queue('reminders', { connection });
      }
    },
    RemindersWorker
  ],
  exports: ['REMINDERS_QUEUE'],
})
export class QueueModule {}
