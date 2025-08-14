import { IsString, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'Consultation with client' })
  @IsString() title!: string;

  @ApiProperty({ example: 1 })
  @IsInt() providerId!: number;

  @ApiProperty({ example: '2025-08-14T10:00:00.000Z' })
  @IsDateString() startAt!: string;

  @ApiProperty({ example: '2025-08-14T10:30:00.000Z' })
  @IsDateString() endAt!: string;
}
