import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1710863286629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            generationStrategy: "increment",
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true
          },
          {
            name: 'cpf',
            type: 'varchar',
            length: '11',
            isUnique: true,
            isNullable: false
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false
        }
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }
}
