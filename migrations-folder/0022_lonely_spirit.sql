ALTER TABLE `log` MODIFY COLUMN `id` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` ADD `is_sunk` boolean DEFAULT false NOT NULL;