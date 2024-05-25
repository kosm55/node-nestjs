import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToUser1716652054131 implements MigrationInterface {
    name = 'AddIsActiveToUser1716652054131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "age" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
    }

}
