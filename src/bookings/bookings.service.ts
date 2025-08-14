import { Injectable, Logger, Inject, Optional } from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { BookingsRepository } from "./bookings.repository";
import { SocketsGateway } from "../socket/sockets.gateway";
import { Queue } from "bullmq";
import { differenceInMilliseconds, parseISO } from "date-fns";
@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  constructor(
    private repo: BookingsRepository,
    private socket: SocketsGateway,
    @Optional() @Inject("REMINDERS_QUEUE") private reminderQueue?: Queue
  ) {}

  async create(dto: CreateBookingDto) {
    const booking = await this.repo.create({
      title: dto.title,
      providerId: dto.providerId,
      startAt: new Date(dto.startAt),
      endAt: new Date(dto.endAt),
    });
    try {
      if (this.reminderQueue) {
        const reminderTime = parseISO(dto.startAt);
        reminderTime.setMinutes(reminderTime.getMinutes() - 10);
        const delay = differenceInMilliseconds(reminderTime, new Date());
        if (delay > 0)
          await this.reminderQueue.add(
            "booking.reminder",
            { bookingId: booking.id },
            { delay }
          );
      }
    } catch (e) {
      this.logger.error("Failed to schedule reminder", e as any);
    }
    this.socket.emitBookingCreated(booking);
    return booking;
  }

  findById(id: number) {
    return this.repo.findById(id);
  }
  async list(page = 1, size = 10, upcoming = true) {
    const now = new Date();
    const skip = (page - 1) * size;
    const take = size;
    if (upcoming) {
      const [items, total] = await Promise.all([
        this.repo.listUpcoming(now, skip, take),
        this.repo.countUpcoming(now),
      ]);
      return { items, total, page, size };
    } else {
      const [items, total] = await Promise.all([
        this.repo.listPast(now, skip, take),
        this.repo.countPast(now),
      ]);
      return { items, total, page, size };
    }
  }
}
