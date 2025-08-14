import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { SocketsGateway } from '../socket/sockets.gateway';

@Injectable()
export class RemindersWorker implements OnModuleInit {
  private readonly logger = new Logger(RemindersWorker.name);
  private worker: Worker | null = null;
  constructor(private prisma: PrismaService, private gateway: SocketsGateway) {}

  onModuleInit() {
    if (this.worker) {
      this.logger.warn("Reminders worker is already initialized.");
      return;
    }
    this.logger.log("Initializing reminders worker...");   
    const connection = new IORedis(
      process.env.REDIS_URL || "redis://redis:6379",
      { maxRetriesPerRequest: null }
    );

    this.worker = new Worker('reminders', async (job) => {
      const { bookingId } = job.data;
      const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking) return;
      this.gateway.emitBookingReminder({ bookingId });
      this.logger.log(`Reminder emitted for booking ${bookingId}`);
    }, { connection });
    this.worker.on('failed', (job, err) => this.logger.error(`Job ${job?.id} failed: ${err}`));
  }
}
