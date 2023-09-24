ALTER TABLE `city` ADD `city_cargo` json DEFAULT ('[]') NOT NULL;--> statement-breakpoint
ALTER TABLE `city` DROP COLUMN `level`;