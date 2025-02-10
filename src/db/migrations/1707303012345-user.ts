import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1738730837114 implements MigrationInterface {
  name = 'Users1738730837114';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`users\` (
            \`id\` varchar(36) NOT NULL,
            \`userName\` varchar(255) NULL,
            \`email\` varchar(255) NOT NULL,
            \`password\` varchar(255) NOT NULL,
            \`isSuperAdmin\` tinyint(1) NOT NULL DEFAULT 0,
            \`isDeleted\` tinyint(1) NOT NULL DEFAULT 0,
            \`providerToken\` varchar(255) NULL,
            UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
