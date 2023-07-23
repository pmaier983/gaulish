ALTER TABLE `accounts` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `accounts` RENAME COLUMN `providerAccountId` TO `provider_account_id`;--> statement-breakpoint
ALTER TABLE `accounts` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `accounts` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `sessions` RENAME COLUMN `sessionToken` TO `session_token`;--> statement-breakpoint
ALTER TABLE `sessions` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `emailVerified` TO `email_verified`;--> statement-breakpoint
ALTER TABLE `accounts` DROP CONSTRAINT `accounts__provider__providerAccountId__idx`;--> statement-breakpoint
ALTER TABLE `sessions` DROP CONSTRAINT `sessions__sessionToken__idx`;--> statement-breakpoint
ALTER TABLE `tile` DROP CONSTRAINT `xy_index`;--> statement-breakpoint
ALTER TABLE `verification_tokens` DROP CONSTRAINT `verification_tokens__token__idx`;--> statement-breakpoint
DROP INDEX `accounts__userId__idx` ON `accounts`;--> statement-breakpoint
DROP INDEX `sessions__userId__idx` ON `sessions`;--> statement-breakpoint
ALTER TABLE `path` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `path` MODIFY COLUMN `path` longtext NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `username` varchar(191) NOT NULL DEFAULT 'Sailor';--> statement-breakpoint
ALTER TABLE `users` ADD `gold` bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `accounts__userId__idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions__userId__idx` ON `sessions` (`user_id`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `hoard_id`;--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts__provider__providerAccountId__idx` UNIQUE(`provider`,`provider_account_id`);--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions__sessionToken__idx` UNIQUE(`session_token`);--> statement-breakpoint
ALTER TABLE `tile` ADD CONSTRAINT `xy__index` UNIQUE(`x`,`y`);--> statement-breakpoint
ALTER TABLE `verification_tokens` ADD CONSTRAINT `verification__tokens__token__idx` UNIQUE(`token`);