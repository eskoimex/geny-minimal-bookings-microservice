"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = __importStar(require("supertest"));
const app_module_1 = require("../../src/app.module");
const jwt_auth_guard_1 = require("../../src/auth/jwt-auth.guard");
const roles_guard_1 = require("../../src/auth/roles.guard");
let MockAuthGuard = class MockAuthGuard {
    canActivate(context) { const req = context.switchToHttp().getRequest(); req.user = { id: 1, role: 'PROVIDER', email: 'test@example.com' }; return true; }
};
MockAuthGuard = __decorate([
    (0, common_1.Injectable)()
], MockAuthGuard);
describe('App (e2e)', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({ imports: [app_module_1.AppModule] })
            .overrideGuard(jwt_auth_guard_1.JwtAuthGuard).useClass(MockAuthGuard)
            .overrideGuard(roles_guard_1.RolesGuard).useClass(MockAuthGuard)
            .compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    afterAll(async () => { await app.close(); });
    it('/bookings (POST) -> create & GET', async () => {
        const create = await request(app.getHttpServer()).post('/bookings').send({
            title: 'E2E booking', providerId: 1,
            startAt: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
            endAt: new Date(Date.now() + 1000 * 60 * 50).toISOString(),
        }).expect(201);
        const id = create.body.id;
        await request(app.getHttpServer()).get(`/bookings/${id}`).expect(200);
    });
});
