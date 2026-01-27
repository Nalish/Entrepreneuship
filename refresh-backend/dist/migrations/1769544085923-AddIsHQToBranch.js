"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIsHQToBranch1769544085923 = void 0;
class AddIsHQToBranch1769544085923 {
    constructor() {
        this.name = 'AddIsHQToBranch1769544085923';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "branch" ADD "isHQ" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "branch" DROP COLUMN "isHQ"`);
    }
}
exports.AddIsHQToBranch1769544085923 = AddIsHQToBranch1769544085923;
