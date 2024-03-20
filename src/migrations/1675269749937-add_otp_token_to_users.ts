import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addOtpTokenToUsers1675269749937 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "user_entity",
            new TableColumn({
                name: "otp_secret",
                type: "varchar",
                isNullable: true
            }),
        )
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
