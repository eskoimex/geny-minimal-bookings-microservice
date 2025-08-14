
import { Test, TestingModule } from "@nestjs/testing";
import {
  INestApplication,
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../src/app.module";
import { JwtAuthGuard } from "../../src/auth/jwt-auth.guard";
import { RolesGuard } from "../../src/auth/roles.guard";

@Injectable()
class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 1, role: "PROVIDER", email: "test@example.com" };
    return true;
  }
}

describe("Bookings E2E (All Endpoints)", () => {
  let app: INestApplication;
  let bookingId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockAuthGuard)
      .overrideGuard(RolesGuard)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /bookings → create booking", async () => {
    const res = await request(app.getHttpServer())
      .post("/bookings")
      .send({
        title: "E2E Booking",
        providerId: 1,
        startAt: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
        endAt: new Date(Date.now() + 1000 * 60 * 50).toISOString(),
      })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    bookingId = res.body.id;
  });

  it("GET /bookings/:id → find booking by ID", async () => {
    const res = await request(app.getHttpServer())
      .get(`/bookings/${bookingId}`)
      .expect(200);

    expect(res.body.id).toBe(bookingId);
    expect(res.body.title).toBe("E2E Booking");
  });

  it("GET /bookings → list upcoming bookings", async () => {
    const res = await request(app.getHttpServer())
      .get("/bookings")
      .query({ page: 1, size: 10, upcoming: true })
      .expect(200);

    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toHaveProperty("total");
  });

  it("GET /bookings → list past bookings", async () => {
    const res = await request(app.getHttpServer())
      .get("/bookings")
      .query({ page: 1, size: 10, upcoming: false })
      .expect(200);

    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).toHaveProperty("total");
  });
});
