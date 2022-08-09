import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1659963204090 implements MigrationInterface {
    name = 'firstMigration1659963204090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar(80) NOT NULL, "password" varchar NOT NULL, "role" varchar NOT NULL, "note" varchar, "created_at" datetime NOT NULL, "deleted_at" datetime)`);
        await queryRunner.query(`CREATE TABLE "report_entity" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(150) NOT NULL, "description" varchar(400), "deviceInfo" text, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar)`);
        await queryRunner.query(`CREATE TABLE "file_entity" ("id" varchar PRIMARY KEY NOT NULL, "fileName" varchar NOT NULL, "bucket" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "type" varchar NOT NULL, "reportId" varchar)`);
        await queryRunner.query(`CREATE TABLE "remote_configuration_entity" ("id" varchar PRIMARY KEY NOT NULL, "shortCode" varchar NOT NULL, "name" varchar NOT NULL, "camouflage" text NOT NULL, "crashReports" text NOT NULL, "serversVisible" boolean NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_report_entity" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(150) NOT NULL, "description" varchar(400), "deviceInfo" text, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar, CONSTRAINT "FK_8a0601e87d9a8c43442f906eca3" FOREIGN KEY ("authorId") REFERENCES "user_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_report_entity"("id", "title", "description", "deviceInfo", "created_at", "updated_at", "authorId") SELECT "id", "title", "description", "deviceInfo", "created_at", "updated_at", "authorId" FROM "report_entity"`);
        await queryRunner.query(`DROP TABLE "report_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_report_entity" RENAME TO "report_entity"`);
        await queryRunner.query(`CREATE TABLE "temporary_file_entity" ("id" varchar PRIMARY KEY NOT NULL, "fileName" varchar NOT NULL, "bucket" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "type" varchar NOT NULL, "reportId" varchar, CONSTRAINT "FK_b1565d43bf183f07479eed71a64" FOREIGN KEY ("reportId") REFERENCES "report_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_file_entity"("id", "fileName", "bucket", "created_at", "updated_at", "type", "reportId") SELECT "id", "fileName", "bucket", "created_at", "updated_at", "type", "reportId" FROM "file_entity"`);
        await queryRunner.query(`DROP TABLE "file_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_file_entity" RENAME TO "file_entity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_entity" RENAME TO "temporary_file_entity"`);
        await queryRunner.query(`CREATE TABLE "file_entity" ("id" varchar PRIMARY KEY NOT NULL, "fileName" varchar NOT NULL, "bucket" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "type" varchar NOT NULL, "reportId" varchar)`);
        await queryRunner.query(`INSERT INTO "file_entity"("id", "fileName", "bucket", "created_at", "updated_at", "type", "reportId") SELECT "id", "fileName", "bucket", "created_at", "updated_at", "type", "reportId" FROM "temporary_file_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_file_entity"`);
        await queryRunner.query(`ALTER TABLE "report_entity" RENAME TO "temporary_report_entity"`);
        await queryRunner.query(`CREATE TABLE "report_entity" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(150) NOT NULL, "description" varchar(400), "deviceInfo" text, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "authorId" varchar)`);
        await queryRunner.query(`INSERT INTO "report_entity"("id", "title", "description", "deviceInfo", "created_at", "updated_at", "authorId") SELECT "id", "title", "description", "deviceInfo", "created_at", "updated_at", "authorId" FROM "temporary_report_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_report_entity"`);
        await queryRunner.query(`DROP TABLE "remote_configuration_entity"`);
        await queryRunner.query(`DROP TABLE "file_entity"`);
        await queryRunner.query(`DROP TABLE "report_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}
