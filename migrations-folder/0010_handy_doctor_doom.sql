ALTER TABLE `path` RENAME COLUMN `path` TO `path_json`;--> statement-breakpoint
ALTER TABLE `path` MODIFY COLUMN `path_json` json NOT NULL;