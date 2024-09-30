import { PrismaClient } from '.prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    await prisma.$connect();
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PWD, 10);

    const existingAdmin = await prisma.admin.findUnique({
        where: { username: 'admin' },
    });

    if (existingAdmin) {
        console.log('Admin user already exists');
    } else {
        await prisma.admin.create({
            data: {
                username: 'admin',
                password: hashedPassword,
            }
        });
        console.log('Admin user created');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });