import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1660066857931 implements MigrationInterface {
    name = 'firstMigration1660066857931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(150) NOT NULL, "slug" varchar(150) NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar(80) NOT NULL, "password" varchar NOT NULL, "role" varchar NOT NULL, "note" varchar, "created_at" datetime NOT NULL, "deleted_at" datetime)`);
        await queryRunner.query(`CREATE TABLE "report_entity" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(150) NOT NULL, "description" varchar(400), "deviceInfo" text, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" varchar, "authorId" varchar)`);
        await queryRunner.query(`CREATE TABLE "file_entity" ("id" varchar PRIMARY KEY NOT NULL, "fileName" varchar NOT NULL, "bucket" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "type" varchar NOT NULL, "reportId" varchar)`);
        await queryRunner.query(`CREATE TABLE "remote_configuration_entity" ("id" varchar PRIMARY KEY NOT NULL, "shortCode" varchar NOT NULL, "name" varchar NOT NULL, "camouflage" text NOT NULL, "crashReports" text NOT NULL, "serversVisible" boolean NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "projects_users" ("project_id" varchar NOT NULL, "user_id" varchar NOT NULL, PRIMARY KEY ("project_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b7d782db86a3dc1bd3b7eaed1f" ON "projects_users" ("project_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_274bd757ae91379bf033a2dacc" ON "projects_users" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "temporary_report_entity" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(150) NOT NULL, "description" varchar(400), "deviceInfo" text, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" varchar, "authorId" varchar, CONSTRAINT "FK_78c383a9b14490fd91f93272986" FOREIGN KEY ("projectId") REFERENCES "project_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8a0601e87d9a8c43442f906eca3" FOREIGN KEY ("authorId") REFERENCES "user_entity" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_report_entity"("id", "title", "description", "deviceInfo", "created_at", "updated_at", "projectId", "authorId") SELECT "id", "title", "description", "deviceInfo", "created_at", "updated_at", "projectId", "authorId" FROM "report_entity"`);
        await queryRunner.query(`DROP TABLE "report_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_report_entity" RENAME TO "report_entity"`);
        await queryRunner.query(`CREATE TABLE "temporary_file_entity" ("id" varchar PRIMARY KEY NOT NULL, "fileName" varchar NOT NULL, "bucket" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "type" varchar NOT NULL, "reportId" varchar, CONSTRAINT "FK_b1565d43bf183f07479eed71a64" FOREIGN KEY ("reportId") REFERENCES "report_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_file_entity"("id", "fileName", "bucket", "created_at", "updated_at", "type", "reportId") SELECT "id", "fileName", "bucket", "created_at", "updated_at", "type", "reportId" FROM "file_entity"`);
        await queryRunner.query(`DROP TABLE "file_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_file_entity" RENAME TO "file_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_b7d782db86a3dc1bd3b7eaed1f"`);
        await queryRunner.query(`DROP INDEX "IDX_274bd757ae91379bf033a2dacc"`);
        await queryRunner.query(`CREATE TABLE "temporary_projects_users" ("project_id" varchar NOT NULL, "user_id" varchar NOT NULL, CONSTRAINT "FK_b7d782db86a3dc1bd3b7eaed1fd" FOREIGN KEY ("project_id") REFERENCES "project_entity" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_274bd757ae91379bf033a2daccd" FOREIGN KEY ("user_id") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("project_id", "user_id"))`);
        await queryRunner.query(`INSERT INTO "temporary_projects_users"("project_id", "user_id") SELECT "project_id", "user_id" FROM "projects_users"`);
        await queryRunner.query(`DROP TABLE "projects_users"`);
        await queryRunner.query(`ALTER TABLE "temporary_projects_users" RENAME TO "projects_users"`);
        await queryRunner.query(`CREATE INDEX "IDX_b7d782db86a3dc1bd3b7eaed1f" ON "projects_users" ("project_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_274bd757ae91379bf033a2dacc" ON "projects_users" ("user_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_274bd757ae91379bf033a2dacc"`);
        await queryRunner.query(`DROP INDEX "IDX_b7d782db86a3dc1bd3b7eaed1f"`);
        await queryRunner.query(`ALTER TABLE "projects_users" RENAME TO "temporary_projects_users"`);
        await queryRunner.query(`CREATE TABLE "projects_users" ("project_id" varchar NOT NULL, "user_id" varchar NOT NULL, PRIMARY KEY ("project_id", "user_id"))`);
        await queryRunner.query(`INSERT INTO "projects_users"("project_id", "user_id") SELECT "project_id", "user_id" FROM "temporary_projects_users"`);
        await queryRunner.query(`DROP TABLE "temporary_projects_users"`);
        await queryRunner.query(`CREATE INDEX "IDX_274bd757ae91379bf033a2dacc" ON "projects_users" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b7d782db86a3dc1bd3b7eaed1f" ON "projects_users" ("project_id") `);
        await queryRunner.query(`ALTER TABLE "file_entity" RENAME TO "temporary_file_entity"`);
        await queryRunner.query(`CREATE TABLE "file_entity" ("id" varchar PRIMARY KEY NOT NULL, "fileName" varchar NOT NULL, "bucket" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "type" varchar NOT NULL, "reportId" varchar)`);
        await queryRunner.query(`INSERT INTO "file_entity"("id", "fileName", "bucket", "created_at", "updated_at", "type", "reportId") SELECT "id", "fileName", "bucket", "created_at", "updated_at", "type", "reportId" FROM "temporary_file_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_file_entity"`);
        await queryRunner.query(`ALTER TABLE "report_entity" RENAME TO "temporary_report_entity"`);
        await queryRunner.query(`CREATE TABLE "report_entity" ("id" varchar PRIMARY KEY NOT NULL, "title" varchar(150) NOT NULL, "description" varchar(400), "deviceInfo" text, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "projectId" varchar, "authorId" varchar)`);
        await queryRunner.query(`INSERT INTO "report_entity"("id", "title", "description", "deviceInfo", "created_at", "updated_at", "projectId", "authorId") SELECT "id", "title", "description", "deviceInfo", "created_at", "updated_at", "projectId", "authorId" FROM "temporary_report_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_report_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_274bd757ae91379bf033a2dacc"`);
        await queryRunner.query(`DROP INDEX "IDX_b7d782db86a3dc1bd3b7eaed1f"`);
        await queryRunner.query(`DROP TABLE "projects_users"`);
        await queryRunner.query(`DROP TABLE "remote_configuration_entity"`);
        await queryRunner.query(`DROP TABLE "file_entity"`);
        await queryRunner.query(`DROP TABLE "report_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
    }

}
