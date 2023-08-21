ALTER TABLE `npc` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `ship` MODIFY COLUMN `id` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `npc` ADD `path_id` varchar(191);--> statement-breakpoint
ALTER TABLE `ship` ADD `path_id` varchar(191);