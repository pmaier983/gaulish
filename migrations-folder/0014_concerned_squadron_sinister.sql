ALTER TABLE `npc` ADD `ship_type` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `npc` ADD `name` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `npc` ADD `speed` int NOT NULL;--> statement-breakpoint
ALTER TABLE `npc` ADD `cargo_capacity` int NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` ADD `ship_type` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` ADD `name` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` ADD `speed` int NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` ADD `cargo_capacity` int NOT NULL;--> statement-breakpoint
ALTER TABLE `npc` DROP COLUMN `ship_type_id`;--> statement-breakpoint
ALTER TABLE `ship` DROP COLUMN `ship_type_id`;