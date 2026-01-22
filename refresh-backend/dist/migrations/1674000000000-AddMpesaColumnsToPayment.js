"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMpesaColumnsToPayment1674000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddMpesaColumnsToPayment1674000000000 {
    async up(queryRunner) {
        await queryRunner.addColumn("payment", new typeorm_1.TableColumn({
            name: "mpesaCheckoutRequestId",
            type: "varchar",
            isNullable: true,
            isUnique: true,
        }));
        await queryRunner.addColumn("payment", new typeorm_1.TableColumn({
            name: "mpesaMerchantRequestId",
            type: "varchar",
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("payment", "mpesaMerchantRequestId");
        await queryRunner.dropColumn("payment", "mpesaCheckoutRequestId");
    }
}
exports.AddMpesaColumnsToPayment1674000000000 = AddMpesaColumnsToPayment1674000000000;
