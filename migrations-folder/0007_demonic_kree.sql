ALTER TABLE `ship` ADD `gold` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` ADD `wheat` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` ADD `wool` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` ADD `stone` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` ADD `wood` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` DROP COLUMN `cargo`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `gold`;