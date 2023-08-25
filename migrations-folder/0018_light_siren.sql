CREATE TABLE `log` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`text` text NOT NULL,
	CONSTRAINT `log_id` PRIMARY KEY(`id`)
);
