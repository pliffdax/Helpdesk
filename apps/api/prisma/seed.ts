import "dotenv/config";
import { PrismaClient, Priority, Role, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.ticket.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const [ivan, olena, admin] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Ivan Petrenko",
        email: "ivan@example.com",
        role: Role.USER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Olena Moroz",
        email: "olena@example.com",
        role: Role.AGENT,
      },
    }),
    prisma.user.create({
      data: {
        name: "Admin Helpdesk",
        email: "admin@example.com",
        role: Role.ADMIN,
      },
    }),
  ]);

  const [auth, ui, infrastructure] = await Promise.all([
    prisma.category.create({ data: { name: "Auth" } }),
    prisma.category.create({ data: { name: "UI" } }),
    prisma.category.create({ data: { name: "Infrastructure" } }),
  ]);

  await prisma.ticket.createMany({
    data: [
      {
        title: "Не вдається увійти в систему",
        description: "Після введення пароля форма входу повертає помилку 401.",
        status: Status.OPEN,
        priority: Priority.HIGH,
        creatorId: ivan.id,
        categoryId: auth.id,
      },
      {
        title: "Проблема з відображенням сторінки профілю",
        description: "На мобільному екрані блок з кнопками виходить за межі контейнера.",
        status: Status.IN_PROGRESS,
        priority: Priority.MEDIUM,
        creatorId: ivan.id,
        categoryId: ui.id,
      },
      {
        title: "Потрібно оновити конфігурацію сервера",
        description: "Після зміни змінних середовища сервіс не бачить нову конфігурацію.",
        status: Status.RESOLVED,
        priority: Priority.LOW,
        creatorId: admin.id,
        categoryId: infrastructure.id,
      },
      {
        title: "Не працює скидання пароля",
        description: "Лист для відновлення пароля не надходить користувачу.",
        status: Status.CLOSED,
        priority: Priority.HIGH,
        creatorId: olena.id,
        categoryId: auth.id,
      },
    ],
  });

  console.log("Seed completed successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
