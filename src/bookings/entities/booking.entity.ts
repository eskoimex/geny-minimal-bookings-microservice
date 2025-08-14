export class BookingEntity {
  id!: number;
  title!: string;
  providerId!: number;
  startAt!: Date;
  endAt!: Date;
  status!: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt!: Date;
}
