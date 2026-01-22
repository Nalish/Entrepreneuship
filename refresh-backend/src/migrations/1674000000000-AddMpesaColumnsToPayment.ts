import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddMpesaColumnsToPayment1674000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "payment",
      new TableColumn({
        name: "mpesaCheckoutRequestId",
        type: "varchar",
        isNullable: true,
        isUnique: true,
      })
    );

    await queryRunner.addColumn(
      "payment",
      new TableColumn({
        name: "mpesaMerchantRequestId",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("payment", "mpesaMerchantRequestId");
    await queryRunner.dropColumn("payment", "mpesaCheckoutRequestId");
  }
}
