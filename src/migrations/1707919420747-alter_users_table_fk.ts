import {MigrationInterface, QueryRunner} from "typeorm";

export class alterUsersTableFk1707919420747 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "ALTER TABLE projects_users DROP FOREIGN KEY FK_274bd757ae91379bf033a2daccd;",
            
        )

        await queryRunner.query(
                "ALTER TABLE projects_users ADD FOREIGN KEY (user_id) REFERENCES user_entity(id) ON DELETE CASCADE;"
        )        

    }


    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
