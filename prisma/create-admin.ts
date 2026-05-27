/**
 * Creates (or resets) the single admin account.
 *
 *   npm run db:admin
 *
 * Override the defaults with env vars:
 *   ADMIN_USERNAME=... ADMIN_PASSWORD=... npm run db:admin
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "shitian2026";

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10);
  await prisma.adminUser.upsert({
    where: { username: USERNAME },
    create: { username: USERNAME, password: hash },
    update: { password: hash }
  });
  console.log("管理员账号已就绪");
  console.log(`  用户名：${USERNAME}`);
  console.log(`  密码：${PASSWORD}`);
  console.log("登录后台地址：/admin/login —— 请尽快修改默认密码。");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
