import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';
import { Permission } from '../entity/permissions.entity';
import Modules from '../../common/enums/modules';
import Roles from '../../common/enums/role';
import Permissions from '../../common/enums/permission';
import { UserRole } from '../entity/userRole.entity';
import dataSourceLocal from '../dataSourceLocal';
import RoleLevel from '../../common/enums/role-level';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await hash(password, saltRounds);
};
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    await dataSourceLocal.initialize();
    const entityManager = dataSourceLocal.manager;

    const permissionsData = [
      { id: uuidv4(), module: Modules.USER, action: Permissions.CREATE },
      { id: uuidv4(), module: Modules.USER, action: Permissions.READ },
      { id: uuidv4(), module: Modules.USER, action: Permissions.UPDATE },
      { id: uuidv4(), module: Modules.USER, action: Permissions.DELETE },
    ];
    const permissions = await entityManager.save(Permission, permissionsData);

    const rolesData = [
      { id: uuidv4(), role: Roles.SUPER_ADMIN, level: RoleLevel.SUPER_ADMIN },
      { id: uuidv4(), role: Roles.ADMIN, level: RoleLevel.ADMIN },
      { id: uuidv4(), role: Roles.USER, level: RoleLevel.USER },
    ];
    const roles = await entityManager.save(Role, rolesData);

    const usersData = [
      {
        id: uuidv4(),
        email: 'superadmin@example.com',
        password: await hashPassword('superadmin_password'),
        isSuperAdmin: true,
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
    const users = await entityManager.save(User, usersData);

    const userRolesData = [
      {
        id: uuidv4(),
        user: users[0],
        role: roles[0],
        permission: permissions[0],
      },
      {
        id: uuidv4(),
        user: users[0],
        role: roles[0],
        permission: permissions[2],
      },
      {
        id: uuidv4(),
        user: users[0],
        role: roles[0],
        permission: permissions[1],
      },
      {
        id: uuidv4(),
        user: users[1],
        role: roles[1],
        permission: permissions[1],
      },
      {
        id: uuidv4(),
        user: users[1],
        role: roles[1],
        permission: permissions[0],
      },
      {
        id: uuidv4(),
        user: users[1],
        role: roles[1],
        permission: permissions[3],
      },
      {
        id: uuidv4(),
        user: users[2],
        role: roles[2],
        permission: permissions[1],
      },
    ];
    await entityManager.save(UserRole, userRolesData);

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error.message || error);
  } finally {
    await dataSourceLocal.destroy();
    console.log('Database connection closed.');
  }
};
seedDatabase();
