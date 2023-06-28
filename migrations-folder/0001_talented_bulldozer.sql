CREATE TABLE `city` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`tile_id` int NOT NULL,
	`level` json);
--> statement-breakpoint
CREATE TABLE `npc` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`npc_type_id` int NOT NULL,
	`path_id` int);
--> statement-breakpoint
CREATE TABLE `path` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`path` text);
--> statement-breakpoint
CREATE TABLE `ship` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`ship_type_id` smallint NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`city_id` int NOT NULL,
	`path_id` int,
	`cargo` json);
--> statement-breakpoint
CREATE TABLE `tile` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`x` int NOT NULL,
	`y` int NOT NULL);
--> statement-breakpoint
ALTER TABLE `users` ADD `hoard_id` int;--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(191);