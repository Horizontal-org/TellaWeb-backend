import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class addGlobalSettings1716208793825 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "global_settings",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp'
                    },
                ],
            }),
            true,
        )

        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // first metric
        await queryRunner.query(
            `INSERT INTO global_settings (id, name, enabled, created_at) VALUES (UUID(), 'DIVVIUP_ANALYTICS', 0, '${createdAt}');`
        )    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("global_settings")
    }

}
