import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });
  const provider = await prisma.user.upsert({
    where: { email: "provider@example.com" },
    update: {},
    create: {
      email: "provider@example.com",
      password: passwordHash,
      role: "PROVIDER",
    },
  });
  const now = new Date();
  const f1s = new Date(now.getTime() + 60 * 60 * 1000);
  const f1e = new Date(f1s.getTime() + 30 * 60 * 1000);
  const f2s = new Date(now.getTime() + 120 * 60 * 1000);
  const f2e = new Date(f2s.getTime() + 45 * 60 * 1000);
  const ps = new Date(now.getTime() - 120 * 60 * 1000);
  const pe = new Date(ps.getTime() + 30 * 60 * 1000);
  await prisma.booking.createMany({
    data: [
      {
        title: "Future Booking 1",
        providerId: provider.id,
        startAt: f1s,
        endAt: f1e,
      },
      {
        title: "Future Booking 2",
        providerId: provider.id,
        startAt: f2s,
        endAt: f2e,
      },
      {
        title: "Past Booking",
        providerId: provider.id,
        startAt: ps,
        endAt: pe,
      },
    ],
  });
  console.log("Seed complete:", {
    admin: admin.email,
    provider: provider.email,
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
