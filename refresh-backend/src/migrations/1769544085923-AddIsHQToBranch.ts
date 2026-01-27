import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsHQToBranch1769544085923 implements MigrationInterface {
    name = 'AddIsHQToBranch1769544085923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch" ADD "isHQ" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch" DROP COLUMN "isHQ"`);
    }

}
