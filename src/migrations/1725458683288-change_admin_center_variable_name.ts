import {MigrationInterface, QueryRunner} from "typeorm";

export class changeAdminCenterVariableName1725458683288 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await queryRunner.query(
            `INSERT INTO global_settings (id, name, enabled, created_at) VALUES (UUID(), 'SUSPICIOUS_LOGIN_DETECTION', 0, '${createdAt}');`
        )    

        await queryRunner.query(
            `DELETE FROM global_settings where name = 'EMAILS';`
        )    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
