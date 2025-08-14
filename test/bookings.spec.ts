import { BookingsService } from "../src/bookings/bookings.service";
import { BookingsRepository } from "../src/bookings/bookings.repository";

describe("BookingsService (unit)", () => {
  it("create should return booking object (mocked)", async () => {
    const repo: any = {
      create: jest.fn().mockResolvedValue({ id: 1, title: "x" }),
    };
    const socket: any = { emitBookingCreated: jest.fn() };
    const bookings = new BookingsService(
      repo as unknown as BookingsRepository,
      socket as any
    );
    (bookings as any)["reminderQueue"] = { add: jest.fn() };
    const dto = {
      title: "t",
      providerId: 1,
      startAt: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
      endAt: new Date(Date.now() + 1000 * 60 * 50).toISOString(),
    };
    const res = await bookings.create(dto as any);
    expect(res).toBeDefined();
    expect(res.id).toBe(1);
  });
});
