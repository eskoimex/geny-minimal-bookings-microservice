import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from "../prisma/prisma.service";
import IORedis from "ioredis";

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private prisma: PrismaService) {}
  @Get('health')
  @ApiOperation({ summary: 'Check health of the service' })
  @ApiOkResponse({
    description: 'Service health status',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            error: { type: 'string', nullable: true, example: 'Error message if any' },
          },
        },
      },
    },
  })
  async health() {
    const redis = new IORedis(process.env.REDIS_URL || 'redis://redis:6379');
    try {
      await redis.ping();
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch (e) {
      return { status: 'error', error: String(e) };
    } finally {
      redis.disconnect();
    }
  }
}
