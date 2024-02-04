CREATE TABLE `gaulish_accounts` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`provider` varchar(191) NOT NULL,
	`provider_account_id` varchar(191) NOT NULL,
	`access_token` text,
	`expires_in` int,
	`id_token` text,
	`refresh_token` text,
	`refresh_token_expires_in` int,
	`scope` varchar(191),
	`token_type` varchar(191),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gaulish_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `accounts_provider_providerAccountId_idx` UNIQUE(`provider`,`provider_account_id`)
);
--> statement-breakpoint
CREATE TABLE `gaulish_cargo` (
	`id` varchar(191) NOT NULL,
	`gold` int NOT NULL DEFAULT 0,
	`wheat` int NOT NULL DEFAULT 0,
	`wool` int NOT NULL DEFAULT 0,
	`stone` int NOT NULL DEFAULT 0,
	`wood` int NOT NULL DEFAULT 0,
	CONSTRAINT `gaulish_cargo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gaulish_city` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`xy_tile_id` varchar(191) NOT NULL,
	`city_cargo` json NOT NULL DEFAULT ('[]'),
	CONSTRAINT `gaulish_city_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gaulish_log` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`ship_id` varchar(191) NOT NULL,
	`text` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `gaulish_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gaulish_npc` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`path_id` varchar(191),
	`ship_type` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`speed` float NOT NULL,
	CONSTRAINT `gaulish_npc_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gaulish_path` (
	`id` varchar(191) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`path_array` json NOT NULL,
	CONSTRAINT `gaulish_path_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gaulish_sessions` (
	`id` varchar(191) NOT NULL,
	`session_token` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`expires` datetime NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gaulish_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_sessionToken_idx` UNIQUE(`session_token`)
);
--> statement-breakpoint
CREATE TABLE `gaulish_ship` (
	`id` varchar(191) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`city_id` int NOT NULL,
	`path_id` varchar(191) NOT NULL DEFAULT 'FAKE_INITIAL_SHIP_PATH_ID',
	`cargo_id` varchar(191) NOT NULL,
	`ship_type` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`speed` float NOT NULL,
	`cargo_capacity` int NOT NULL,
	`is_sunk` boolean NOT NULL DEFAULT false,
	CONSTRAINT `gaulish_ship_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gaulish_tile` (
	`xy_tile_id` varchar(191) NOT NULL,
	`x` int NOT NULL,
	`y` int NOT NULL,
	`ship_type` varchar(191) NOT NULL,
	CONSTRAINT `gaulish_tile_xy_tile_id` PRIMARY KEY(`xy_tile_id`),
	CONSTRAINT `xy_index` UNIQUE(`x`,`y`)
);
--> statement-breakpoint
CREATE TABLE `gaulish_users` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191) NOT NULL,
	`email_verified` timestamp,
	`image` varchar(191),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`username` varchar(191) NOT NULL DEFAULT 'Sailor',
	`known_tiles` json NOT NULL DEFAULT ('[]'),
	CONSTRAINT `gaulish_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `gaulish_verification_tokens` (
	`identifier` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`expires` datetime NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gaulish_verification_tokens_identifier` PRIMARY KEY(`identifier`),
	CONSTRAINT `verification_tokens_token_idx` UNIQUE(`token`)
);
--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
DROP TABLE `cargo`;--> statement-breakpoint
DROP TABLE `city`;--> statement-breakpoint
DROP TABLE `log`;--> statement-breakpoint
DROP TABLE `npc`;--> statement-breakpoint
DROP TABLE `path`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
DROP TABLE `ship`;--> statement-breakpoint
DROP TABLE `tile`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
DROP TABLE `verification_tokens`;--> statement-breakpoint
CREATE INDEX `accounts_userId_idx` ON `gaulish_accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_userId_idx` ON `gaulish_sessions` (`user_id`);