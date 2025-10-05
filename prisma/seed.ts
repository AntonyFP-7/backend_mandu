import { PrismaClient } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeder...');

  // Crear Ambassadors por defecto
  console.log('📊 Creando Ambassadors...');
  const ambassador1 = await prisma.ambassador.upsert({
    where: { id: 1 },
    update: {},
    create: {
      fullName: 'Juan Carlos Pérez',
    },
  });

  const ambassador2 = await prisma.ambassador.upsert({
    where: { id: 2 },
    update: {},
    create: {
      fullName: 'María Elena García',
    },
  });

  const ambassador3 = await prisma.ambassador.upsert({
    where: { id: 3 },
    update: {},
    create: {
      fullName: 'Roberto Silva Mendoza',
    },
  });

  console.log('✅ Ambassadors creados:', {
    ambassador1,
    ambassador2,
    ambassador3,
  });

  // Crear Divisions con jerarquía (División principal -> Subdivisiones)
  console.log('🏢 Creando Divisions...');

  // División principal (sin parent)
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // como podria elegir una opcion aleatoria levels
  function random(arr: any) {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  }
  const divisionPrincipal = await prisma.division.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Gerencia General',
      level: random(levels),
      status: true,
      ambassadorId: ambassador1.id,
    },
  });

  // Subdivisiones de nivel 2
  const divisionTecnologia = await prisma.division.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Tecnología',
      level: 2,
      status: true,
      ambassadorId: ambassador2.id,
      parentId: divisionPrincipal.id,
    },
  });

  const divisionRecursosHumanos = await prisma.division.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Recursos Humanos',
      level: random(levels),
      status: true,
      parentId: divisionTecnologia.id,
    },
  });

  const divisionVentas = await prisma.division.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Ventas',
      level: random(levels),
      status: true,
      parentId: divisionPrincipal.id,
    },
  });

  // Subdivisiones de nivel 3
  const divisionDesarrollo = await prisma.division.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'Desarrollo',
      level: random(levels),
      status: true,
      parentId: divisionVentas.id,
    },
  });

  const divisionQA = await prisma.division.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'Quality Assurance',
      level: random(levels),
      status: true,
      ambassadorId: ambassador3.id,
    },
  });

  console.log('✅ Divisions creadas:', {
    divisionPrincipal,
    divisionTecnologia,
    divisionRecursosHumanos,
    divisionVentas,
    divisionDesarrollo,
    divisionQA,
  });

  // Crear Employees por defecto
  console.log('👥 Creando Employees...');

  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { id: 1 },
      update: {},
      create: {
        firstName: 'Ana',
        lastName: 'González',
        email: 'ana.gonzalez@empresa.com',
        phone: '+1234567890',
        status: true,
        divisionId: divisionPrincipal.id,
      },
    }),
    prisma.employee.upsert({
      where: { id: 2 },
      update: {},
      create: {
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@empresa.com',
        phone: '+1234567891',
        status: true,
        divisionId: divisionDesarrollo.id,
      },
    }),
    prisma.employee.upsert({
      where: { id: 3 },
      update: {},
      create: {
        firstName: 'Sofia',
        lastName: 'Martínez',
        email: 'sofia.martinez@empresa.com',
        phone: '+1234567892',
        status: true,
        divisionId: divisionDesarrollo.id,
      },
    }),
    prisma.employee.upsert({
      where: { id: 4 },
      update: {},
      create: {
        firstName: 'Luis',
        lastName: 'Hernández',
        email: 'luis.hernandez@empresa.com',
        phone: '+1234567893',
        status: true,
        divisionId: divisionQA.id,
      },
    }),
    prisma.employee.upsert({
      where: { id: 5 },
      update: {},
      create: {
        firstName: 'Elena',
        lastName: 'López',
        email: 'elena.lopez@empresa.com',
        phone: '+1234567894',
        status: true,
        divisionId: divisionRecursosHumanos.id,
      },
    }),
    prisma.employee.upsert({
      where: { id: 6 },
      update: {},
      create: {
        firstName: 'Miguel',
        lastName: 'Torres',
        email: 'miguel.torres@empresa.com',
        phone: '+1234567895',
        status: true,
        divisionId: divisionVentas.id,
      },
    }),
  ]);

  console.log('✅ Employees creados:', employees.length, 'empleados');
  
  //creamos 1 usuario admin
  console.log('👤 Creando usuario administrador...');
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('admin123', saltRounds);
  
  const adminUser = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: 'admin@mandu.com',
      password: hashedPassword, // Contraseña hasheada con bcrypt
      status: true,
    },
  });

  console.log('✅ Usuario administrador creado:', {
    id: adminUser.id,
    email: adminUser.email,
    status: adminUser.status
  });

  console.log('🎉 Seeder completado exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
