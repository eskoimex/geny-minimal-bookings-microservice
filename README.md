
# 📅 Bookings Microservice (NestJS + Prisma + Redis + Socket.IO)

A fully-featured **Bookings microservice** built with **NestJS**, **Prisma (PostgreSQL)**, **Redis**, and **Socket.IO**.  
Includes repository pattern, queue-based background jobs, real-time updates via WebSocket, Swagger documentation, seed data, and CI/CD pipeline.


# NestJS + Prisma Bookings Microservice

This is a **NestJS + Prisma** microservice for managing bookings, built with a professional architecture including:

- **NestJS** modular architecture
- **Prisma ORM** with PostgreSQL schema & migrations
- **Repository Layer** for data access abstraction
- **Booking CRUD** with validation (DTOs)
- **Queue Processing** using **BullMQ** + Redis
- **Real-time updates** with **Socket.IO** + Redis Adapter
- **Swagger/OpenAPI** documentation (`/docs`)
- **Seed Script** (`npm run seed`) for local testing
- **GitHub Actions** CI workflow for testing & build
- **Multi-stage Dockerfile** for production
- **Unit & E2E Tests** with Jest
- Repository pattern for cleaner data access logic
- Prisma ORM integration with PostgreSQL
- Modular NestJS structure with clear separation of concerns
- Environment-based configuration
- Test bypass for E2E (mock Redis & queues)

---

## 📂 Project Structure

```plaintext
.
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Prisma migrations
│   └── seed.ts               # Database seed script
│
├── src/
│   ├── app.module.ts         # Root application module
│   ├── main.ts               # Application bootstrap
│   │
│   ├── bookings/
│   │   ├── bookings.controller.ts   # REST endpoints
│   │   ├── bookings.service.ts      # Business logic
│   │   ├── bookings.repository.ts   # DB access
│   │   ├── dto/                     # DTO validation classes
│   │   └── entities/                # Entity interfaces/types
│   │
│   ├── queue/
│   │   ├── queue.module.ts
│   │   └── queue.processor.ts       # BullMQ job processors
│   │
│   ├── socket/
│   │   ├── socket.gateway.ts        # WebSocket gateway
│   │   └── socket.module.ts        # Redis socket module
│   |
│   └── tests/                       # Unit & E2E test files
│
├── .github/workflows/ci.yml         # GitHub Actions CI
├── Dockerfile                       # Multi-stage build
├── docker-compose.yml               # Local dev services
├── .env.example                     # Sample env vars
├── package.json
└── README.md
```

---

## 🛠 Features Implemented

### 1. Repository Layer
All database access is abstracted in dedicated repository classes using **PrismaService** for cleaner, testable code.

Example:
```ts
@Injectable()
export class BookingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BookingCreateInput) {
    return this.prisma.booking.create({ data });
  }
}
```

---

### 2. Prisma ORM with PostgreSQL
- Schema defined in `prisma/schema.prisma`
- Migrations handled via:
```bash
npx prisma migrate dev
```
- Fully typed database queries.

---

### 3. BullMQ Queue Wiring
- Redis-backed queues for processing jobs asynchronously
- Configurable queues located in `src/queue`
- Worker processes decoupled from API

Example queue processor:
```ts
// @Processor('bookingQueue')
// export class BookingProcessor {
//   @Process('sendConfirmationEmail')
//   async handleJob(job: Job) {
//     console.log('Sending confirmation email:', job.data);
//   }
// }
 this.logger.log("Initializing reminders worker...");   
    const connection = new IORedis(
      process.env.REDIS_URL || "redis://redis:6379",
      { maxRetriesPerRequest: null }
    );
```

---

### 4. Redis Socket Adapter
- Socket.IO with Redis adapter for scalable real-time events
- Configured to support multiple instances across distributed systems

Example setup:
```ts
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

---

### 5. Multi-Stage Dockerfile
- **Stage 1**: Build dependencies
- **Stage 2**: Production image with compiled JS
- Reduces image size for deployment

---

### 6. E2E Test Bypass
- Environment variable `E2E_TEST_MODE=true` disables certain startup processes (e.g., Redis connection, queues)
- Makes automated testing faster and isolated

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL ≥ 14
- Redis ≥ 6
- Node.js ≥ 18
- npm ≥ 9
- Docker (optional for containerized setup)

### Installation
```bash
# Clone the repository (dev branch)
git clone --branch dev https://github.com/eskoimex/geny-minimal-bookings-microservice.git
cd dir
npm install
```

### Environment Variables
Create a `.env` file in the project root:
```
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
REDIS_URL=redis://localhost:6379
PORT=3000
PORT=3000
JWT_SECRET=supersecret
```

### Running Migration and seed
```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

### Running Locally
```bash
npm run start:dev
```

### Running Tests
```bash
npm run test
npm run test:e2e
```

### Build for Production
```bash
npm run build
npm run start:prod
```

---

## 📦 Docker Deployment

### Build Image
```bash
docker build -t bookings-service .
```

### Run Container
```bash
docker run -p 3000:3000 --env-file .env bookings-service
```

---

## 📚 API Endpoints

### Bookings
| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| POST   | /bookings        | Create a booking   |
| GET    | /bookings        | List bookings (Upcoming/Past)   |
| GET    | /bookings/:id    | Get booking by ID  |


---

## 🧪 Testing
- **Unit tests** for services and repositories
- **E2E tests** for API endpoints

---

## 🔧 Technologies Used
- **NestJS** – Scalable Node.js framework
- **Prisma ORM** – Type-safe database access
- **PostgreSQL** – Relational database
- **BullMQ + Redis** – Queue processing
- **Socket.IO** – Real-time communication
- **Docker** – Containerized deployment
- **Jest** – Testing framework

