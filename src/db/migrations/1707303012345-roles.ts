import { MigrationInterface, QueryRunner } from 'typeorm';

export class Roles1738736350472 implements MigrationInterface {
  name = 'Roles1738736350472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`roles\` (
            \`id\` varchar(36) NOT NULL,
            \`role\` varchar(255) NOT NULL,
            \`level\` int NOT NULL DEFAULT '0',
            \`isDeleted\` tinyint(1) NOT NULL DEFAULT 0,
            UNIQUE INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` (\`role\`),
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
  }
}
