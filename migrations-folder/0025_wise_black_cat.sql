CREATE TABLE `cargo` (
	`id` varchar(191) NOT NULL,
	`gold` int NOT NULL DEFAULT 0,
	`wheat` int NOT NULL DEFAULT 0,
	`wool` int NOT NULL DEFAULT 0,
	`stone` int NOT NULL DEFAULT 0,
	`wood` int NOT NULL DEFAULT 0,
	CONSTRAINT `cargo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ship` ADD `cargo_id` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` DROP COLUMN `gold`;--> statement-breakpoint
ALTER TABLE `ship` DROP COLUMN `wheat`;--> statement-breakpoint
ALTER TABLE `ship` DROP COLUMN `wool`;--> statement-breakpoint
ALTER TABLE `ship` DROP COLUMN `stone`;--> statement-breakpoint
ALTER TABLE `ship` DROP COLUMN `wood`;