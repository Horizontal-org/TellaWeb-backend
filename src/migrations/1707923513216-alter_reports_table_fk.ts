import {MigrationInterface, QueryRunner} from "typeorm";

export class alterReportsTableFk1707923513216 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE report_entity DROP FOREIGN KEY FK_8a0601e87d9a8c43442f906eca3;",
            
        )

        await queryRunner.query(
            "ALTER TABLE report_entity ADD FOREIGN KEY (authorId) REFERENCES user_entity(id) ON DELETE SET NULL;"
        )        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
