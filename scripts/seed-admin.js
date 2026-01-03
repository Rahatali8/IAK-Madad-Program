const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin already exists
    const email = 'himyyatadmin@gmail.com';
    const password = 'admin123';
    const cnic = '9999999999999'; // Change if you want a specific CNIC
    const name = 'Himayat Admin';

    const existingAdmin = await prisma.admin.findFirst({
      where: { email }
    });
    if (existingAdmin) {
      console.log('Admin already exists!');
      return;
    }
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        cnic,
        password: bcrypt.hashSync(password, 10)
      }
    });
    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🆔 CNIC:', cnic);
    console.log('Admin ID:', admin.id);

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

