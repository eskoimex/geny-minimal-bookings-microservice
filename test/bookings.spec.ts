import { BookingsService } from "../src/bookings/bookings.service";
import { BookingsRepository } from "../src/bookings/bookings.repository";
import { BookingStatus } from "@prisma/client";

describe("BookingsService (unit)", () => {
  let repo: jest.Mocked<BookingsRepository>;
  let socket: any;
  let service: BookingsService;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findById: jest.fn(),
      listUpcoming: jest.fn(),
      countUpcoming: jest.fn(),
      listPast: jest.fn(),
      countPast: jest.fn(),
    } as any;

    socket = { emitBookingCreated: jest.fn() };

    service = new BookingsService(repo, socket);
  });

  describe("create", () => {
    it("should return booking object (mocked)", async () => {
      const bookingMock = {
        id: 1,
        title: "x",
        startAt: new Date(Date.now() + 1000 * 60 * 20),
        endAt: new Date(Date.now() + 1000 * 60 * 50),
        status: BookingStatus.PENDING,
        createdAt: new Date(),
        providerId: 1,
      };
      repo.create.mockResolvedValue(bookingMock);
      (service as any)["reminderQueue"] = { add: jest.fn() };

      const dto = {
        title: "t",
        providerId: 1,
        startAt: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
        endAt: new Date(Date.now() + 1000 * 60 * 50).toISOString(),
      };

      const res = await service.create(dto as any);

      expect(res).toBeDefined();
      expect(res.id).toBe(1);
      expect(socket.emitBookingCreated).toHaveBeenCalledWith(bookingMock);
    });
  });

  describe("findById", () => {
    it("should return booking by id", async () => {
      const bookingMock = {
        id: 1,
        title: "x",
        startAt: new Date(Date.now() + 1000 * 60 * 20),
        endAt: new Date(Date.now() + 1000 * 60 * 50),
        status: BookingStatus.PENDING,
        createdAt: new Date(),
        providerId: 1,
      };
      repo.findById.mockResolvedValue(bookingMock);

      const result = await service.findById(2);

      expect(repo.findById).toHaveBeenCalledWith(2);
      expect(result).toEqual(bookingMock);
    });
  });

  describe("list", () => {
    it("should return upcoming bookings", async () => {
      const itemsMock = [
        {
          id: 3,
          title: "upcoming",
          startAt: new Date(Date.now() + 1000 * 60 * 20),
          endAt: new Date(Date.now() + 1000 * 60 * 50),
          status: BookingStatus.PENDING,
          createdAt: new Date(),
          providerId: 1,
        },
      ];
      repo.listUpcoming.mockResolvedValue(itemsMock);
      repo.countUpcoming.mockResolvedValue(1);

      const result = await service.list(1, 10, true);

      expect(repo.listUpcoming).toHaveBeenCalled();
      expect(repo.countUpcoming).toHaveBeenCalled();
      expect(result.items).toEqual(itemsMock);
      expect(result.total).toBe(1);
    });

    it("should return past bookings", async () => {
      const itemsMock = [
        {
          id: 4,
          title: "past",
          startAt: new Date(),
          endAt: new Date(),
          status: BookingStatus.CONFIRMED,
          createdAt: new Date(),
          providerId: 1,
        },
      ];
      repo.listPast.mockResolvedValue(itemsMock);
      repo.countPast.mockResolvedValue(1);

      const result = await service.list(1, 10, false);

      expect(repo.listPast).toHaveBeenCalled();
      expect(repo.countPast).toHaveBeenCalled();
      expect(result.items).toEqual(itemsMock);
      expect(result.total).toBe(1);
    });
  });
});
