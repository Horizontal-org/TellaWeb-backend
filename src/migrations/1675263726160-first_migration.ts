import {MigrationInterface, QueryRunner} from "typeorm";

export class firstMigration1675263726160 implements MigrationInterface {
    name = 'firstMigration1675263726160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `project_entity` (`id` varchar(36) NOT NULL, `name` varchar(150) NOT NULL, `slug` varchar(150) NOT NULL, `url` varchar(255) NULL, `created_at` datetime NOT NULL, `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_entity` (`id` varchar(36) NOT NULL, `username` varchar(80) NOT NULL, `password` varchar(255) NOT NULL, `role` varchar(255) NOT NULL, `note` varchar(255) NULL, `created_at` datetime NOT NULL, `deleted_at` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `report_entity` (`id` varchar(36) NOT NULL, `title` varchar(150) NOT NULL, `description` varchar(400) NULL, `deviceInfo` text NULL, `created_at` datetime NOT NULL, `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `projectId` varchar(36) NULL, `authorId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `file_entity` (`id` varchar(36) NOT NULL, `fileName` varchar(255) NOT NULL, `bucket` varchar(255) NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `type` varchar(255) NOT NULL, `fileInfo` text NULL, `reportId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `remote_configuration_entity` (`id` varchar(36) NOT NULL, `shortCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `camouflage` text NOT NULL, `crashReports` text NOT NULL, `serversVisible` tinyint NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `projects_users` (`project_id` varchar(36) NOT NULL, `user_id` varchar(36) NOT NULL, INDEX `IDX_b7d782db86a3dc1bd3b7eaed1f` (`project_id`), INDEX `IDX_274bd757ae91379bf033a2dacc` (`user_id`), PRIMARY KEY (`project_id`, `user_id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `report_entity` ADD CONSTRAINT `FK_78c383a9b14490fd91f93272986` FOREIGN KEY (`projectId`) REFERENCES `project_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `report_entity` ADD CONSTRAINT `FK_8a0601e87d9a8c43442f906eca3` FOREIGN KEY (`authorId`) REFERENCES `user_entity`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `file_entity` ADD CONSTRAINT `FK_b1565d43bf183f07479eed71a64` FOREIGN KEY (`reportId`) REFERENCES `report_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `projects_users` ADD CONSTRAINT `FK_b7d782db86a3dc1bd3b7eaed1fd` FOREIGN KEY (`project_id`) REFERENCES `project_entity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `projects_users` ADD CONSTRAINT `FK_274bd757ae91379bf033a2daccd` FOREIGN KEY (`user_id`) REFERENCES `user_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `projects_users` DROP FOREIGN KEY `FK_274bd757ae91379bf033a2daccd`");
        await queryRunner.query("ALTER TABLE `projects_users` DROP FOREIGN KEY `FK_b7d782db86a3dc1bd3b7eaed1fd`");
        await queryRunner.query("ALTER TABLE `file_entity` DROP FOREIGN KEY `FK_b1565d43bf183f07479eed71a64`");
        await queryRunner.query("ALTER TABLE `report_entity` DROP FOREIGN KEY `FK_8a0601e87d9a8c43442f906eca3`");
        await queryRunner.query("ALTER TABLE `report_entity` DROP FOREIGN KEY `FK_78c383a9b14490fd91f93272986`");
        await queryRunner.query("DROP INDEX `IDX_274bd757ae91379bf033a2dacc` ON `projects_users`");
        await queryRunner.query("DROP INDEX `IDX_b7d782db86a3dc1bd3b7eaed1f` ON `projects_users`");
        await queryRunner.query("DROP TABLE `projects_users`");
        await queryRunner.query("DROP TABLE `remote_configuration_entity`");
        await queryRunner.query("DROP TABLE `file_entity`");
        await queryRunner.query("DROP TABLE `report_entity`");
        await queryRunner.query("DROP TABLE `user_entity`");
        await queryRunner.query("DROP TABLE `project_entity`");
    }

}
