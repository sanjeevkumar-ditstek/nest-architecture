import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPermissions1738736445221 implements MigrationInterface {
  name = 'UserPermissions1738736445221';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`userRoles\` (
            \`id\` varchar(36) NOT NULL,
            \`isDeleted\` tinyint(1) NOT NULL DEFAULT 0,
            \`userId\` varchar(36) NULL,
            \`roleId\` varchar(36) NULL,
            \`permissionId\` varchar(36) NULL,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);

    await queryRunner.query(
      `ALTER TABLE \`userRoles\` ADD CONSTRAINT \`FK_user_roles_users\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`userRoles\` ADD CONSTRAINT \`FK_user_roles_roles\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`userRoles\` ADD CONSTRAINT \`FK_user_roles_permissions\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`userRoles\` DROP FOREIGN KEY \`FK_user_roles_permissions\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`userRoles\` DROP FOREIGN KEY \`FK_user_roles_roles\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`userRoles\` DROP FOREIGN KEY \`FK_user_roles_users\``,
    );
    await queryRunner.query(`DROP TABLE \`userRoles\``);
  }
}
