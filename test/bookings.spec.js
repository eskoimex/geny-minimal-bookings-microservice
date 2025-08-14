"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bookings_service_1 = require("../src/bookings/bookings.service");
describe('BookingsService (unit)', () => {
    it('create should return booking object (mocked)', async () => {
        const repo = { create: jest.fn().mockResolvedValue({ id: 1, title: 'x' }) };
        const socket = { emitBookingCreated: jest.fn() };
        const bookings = new bookings_service_1.BookingsService(repo, socket);
        bookings['reminderQueue'] = { add: jest.fn() };
        const dto = { title: 't', providerId: 1, startAt: new Date(Date.now() + 1000 * 60 * 20).toISOString(), endAt: new Date(Date.now() + 1000 * 60 * 50).toISOString() };
        const res = await bookings.create(dto);
        expect(res).toBeDefined();
        expect(res.id).toBe(1);
    });
});
