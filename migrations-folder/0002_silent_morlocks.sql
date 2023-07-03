ALTER TABLE `tile` ADD `type_id` smallint NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `xy_index` ON `tile` (`x`,`y`);