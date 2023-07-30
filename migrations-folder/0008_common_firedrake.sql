ALTER TABLE `city` ADD `xy_tile_id` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `tile` ADD `xy_tile_id` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `city` DROP COLUMN `tile_id`;