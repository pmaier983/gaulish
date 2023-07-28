ALTER TABLE `accounts` DROP CONSTRAINT `accounts__provider__providerAccountId__idx`;--> statement-breakpoint
ALTER TABLE `sessions` DROP CONSTRAINT `sessions__sessionToken__idx`;--> statement-breakpoint
ALTER TABLE `tile` DROP CONSTRAINT `xy__index`;--> statement-breakpoint
ALTER TABLE `users` DROP CONSTRAINT `users__email__idx`;--> statement-breakpoint
ALTER TABLE `verification_tokens` DROP CONSTRAINT `verification__tokens__token__idx`;--> statement-breakpoint
DROP INDEX `accounts__userId__idx` ON `accounts`;--> statement-breakpoint
DROP INDEX `sessions__userId__idx` ON `sessions`;--> statement-breakpoint
CREATE INDEX `accounts_userId_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_userId_idx` ON `sessions` (`user_id`);--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_provider_providerAccountId_idx` UNIQUE(`provider`,`provider_account_id`);--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_sessionToken_idx` UNIQUE(`session_token`);--> statement-breakpoint
ALTER TABLE `tile` ADD CONSTRAINT `xy_index` UNIQUE(`x`,`y`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_idx` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `verification_tokens` ADD CONSTRAINT `verification_tokens_token_idx` UNIQUE(`token`);