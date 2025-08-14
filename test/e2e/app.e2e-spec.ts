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
describe("App (e2e)", () => {
  let app: INestApplication;
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
  it("/bookings (POST) -> create & GET", async () => {
    const create = await request(app.getHttpServer())
      .post("/bookings")
      .send({
        title: "E2E booking",
        providerId: 1,
        startAt: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
        endAt: new Date(Date.now() + 1000 * 60 * 50).toISOString(),
      })
      .expect(201);
    const id = create.body.id;
    await request(app.getHttpServer()).get(`/bookings/${id}`).expect(200);
  });
});
