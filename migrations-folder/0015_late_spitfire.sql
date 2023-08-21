ALTER TABLE `npc` MODIFY COLUMN `id` varchar(191);--> statement-breakpoint
ALTER TABLE `ship` MODIFY COLUMN `id` varchar(191);--> statement-breakpoint
ALTER TABLE `npc` DROP COLUMN `path_id`;--> statement-breakpoint
ALTER TABLE `ship` DROP COLUMN `path_id`;