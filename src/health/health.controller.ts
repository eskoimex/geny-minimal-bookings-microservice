import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import IORedis from "ioredis";

@Controller("health")
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async health() {
    const redis = new IORedis(process.env.REDIS_URL || "redis://redis:6379");
    try {
      await redis.ping();
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok" };
    } catch (e) {
      return { status: "error", error: String(e) };
    } finally {
      redis.disconnect();
    }
  }
}
