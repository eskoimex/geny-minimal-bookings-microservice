import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BookingsRepository {
  constructor(private prisma: PrismaService) {}

  create(data: {
    title: string;
    providerId: number;
    startAt: Date;
    endAt: Date;
  }) {
    return this.prisma.booking.create({ data });
  }

  findById(id: number) {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  listUpcoming(now: Date, skip: number, take: number) {
    return this.prisma.booking.findMany({
      where: { startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      skip,
      take,
    });
  }

  listPast(now: Date, skip: number, take: number) {
    return this.prisma.booking.findMany({
      where: { endAt: { lt: now } },
      orderBy: { startAt: "asc" },
      skip,
      take,
    });
  }

  countUpcoming(now: Date) {
    return this.prisma.booking.count({ where: { startAt: { gte: now } } });
  }

  countPast(now: Date) {
    return this.prisma.booking.count({ where: { endAt: { lt: now } } });
  }
}
