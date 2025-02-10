import { MigrationInterface, QueryRunner } from 'typeorm';

export class Permissions1738736374267 implements MigrationInterface {
  name = 'Permissions1738736374267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`permissions\` (
            \`id\` varchar(36) NOT NULL,
            \`module\` varchar(255) NOT NULL,
            \`action\` varchar(255) NOT NULL,
            \`isDeleted\` tinyint(1) NOT NULL DEFAULT 0,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`permissions\``);
  }
}
