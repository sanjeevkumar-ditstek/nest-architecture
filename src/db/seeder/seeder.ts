import { Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';
import { User } from '../schemas/user.schema';
import { Role } from '../schemas/role.schema';
import { Permission } from '../schemas/permissions.schema';
import Modules from '../../common/enums/modules';
import Roles from '../../common/enums/role';
import Permissions from '../../common/enums/permission';
import { UserRole } from '../schemas/userRole.schema';

const sequelize = new Sequelize(
  'mysql://root:Qwerty!@1234@localhost:3306/nestjs_project',
  {
    dialect: 'mysql',
    models: [Permission, User, Role, UserRole],
  },
);

// Function to hash passwords
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await hash(password, saltRounds);
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Sync models with the database
    await sequelize.sync({ force: true });

    // Permissions data
    const permissionsData = [
      { id: uuidv4(), module: Modules.PRODUCT, action: Permissions.CREATE },
      { id: uuidv4(), module: Modules.PRODUCT, action: Permissions.READ },
      { id: uuidv4(), module: Modules.PRODUCT, action: Permissions.UPDATE },
      { id: uuidv4(), module: Modules.PRODUCT, action: Permissions.DELETE },
    ];
    const permissions = await Permission.bulkCreate(permissionsData);
    console.log('Permissions seeded:', permissions);

    // Roles data
    const rolesData = [
      { id: uuidv4(), role: Roles.SUPER_ADMIN },
      { id: uuidv4(), role: Roles.ADMIN },
      { id: uuidv4(), role: Roles.USER },
    ];
    const roles = await Role.bulkCreate(rolesData);
    console.log('Roles seeded:', roles);

    // Users data
    const usersData = [
      {
        id: uuidv4(),
        email: 'superadmin@example.com',
        password: await hashPassword('superadmin_password'),
      },
      {
        id: uuidv4(),
        email: 'admin@example.com',
        password: await hashPassword('admin_password'),
      },
      {
        id: uuidv4(),
        email: 'user@example.com',
        password: await hashPassword('user_password'),
      },
    ];
    const users = await User.bulkCreate(usersData);
    console.log('Users seeded:', users);

    // User-Role-Permission data
    const userRolesData = [
      {
        id: uuidv4(),
        userId: users[0].id,
        roleId: roles[0].id,
        permissionId: permissions[0].id,
      },
      {
        id: uuidv4(),
        userId: users[0].id,
        roleId: roles[0].id,
        permissionId: permissions[2].id,
      },
      {
        id: uuidv4(),
        userId: users[0].id,
        roleId: roles[0].id,
        permissionId: permissions[1].id,
      },
      {
        id: uuidv4(),
        userId: users[1].id,
        roleId: roles[1].id,
        permissionId: permissions[1].id,
      },
      {
        id: uuidv4(),
        userId: users[1].id,
        roleId: roles[1].id,
        permissionId: permissions[0].id,
      },
      {
        id: uuidv4(),
        userId: users[1].id,
        roleId: roles[1].id,
        permissionId: permissions[3].id,
      },
      {
        id: uuidv4(),
        userId: users[2].id,
        roleId: roles[2].id,
        permissionId: permissions[1].id,
      },
    ];
    const userRoles = await UserRole.bulkCreate(userRolesData);
    console.log('User roles seeded:', userRoles);

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error.message || error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

seedDatabase();
