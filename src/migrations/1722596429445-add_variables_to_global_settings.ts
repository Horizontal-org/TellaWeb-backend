import {MigrationInterface, QueryRunner} from "typeorm";

export class addVariablesToGlobalSettings1722596429445 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await queryRunner.query(
            `INSERT INTO global_settings (id, name, enabled, created_at) VALUES (UUID(), 'EMAILS', 0, '${createdAt}');`
        )    

        await queryRunner.query(
            `INSERT INTO global_settings (id, name, enabled, created_at) VALUES (UUID(), 'FEEDBACK', 0, '${createdAt}');`
        )    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
