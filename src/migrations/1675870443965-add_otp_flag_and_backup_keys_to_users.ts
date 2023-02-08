import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addOtpFlagAndBackupKeysToUsers1675870443965 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "user_entity",
            new TableColumn({
                name: "otp_active",
                type: "boolean",
                isNullable: false,
                default: false
            }),
        )

        await queryRunner.addColumn(
            "user_entity",
            new TableColumn({
                name: "backup_key",
                type: "varchar",
                isNullable: true,
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(
            "user_entity",
            'otp_active'
        )

        await queryRunner.dropColumn(
            "user_entity",
            'backup_key'
        )
    }

}
