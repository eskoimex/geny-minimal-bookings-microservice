import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BookingsService } from './bookings.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller()
export class BookingsGrpcController {
  constructor(
    private readonly bookingsService: BookingsService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  @GrpcMethod('BookingsService', 'CreateBooking')
  async createBooking(dto: CreateBookingDto) {
    const booking = await this.bookingsService.create({
      title: dto.title,
      providerId: dto.providerId,
      startAt: dto.startAt,
      endAt: dto.endAt,
    });

    const payload = {
      id: booking.id.toString(),
      title: booking.title,
      providerId: booking.providerId,
      startAt: booking.startAt.toISOString(),
      endAt: booking.endAt.toISOString(),
    };

    await this.redis.publish('booking.created', JSON.stringify(payload));
    return payload;
  }
}
