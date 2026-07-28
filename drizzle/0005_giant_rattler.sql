CREATE TABLE `games` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text,
	`genre` varchar(128),
	`platform` varchar(128),
	`status` enum('active','beta','maintenance','inactive') NOT NULL DEFAULT 'active',
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `games_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `banners` ADD `startDate` varchar(20);--> statement-breakpoint
ALTER TABLE `banners` ADD `endDate` varchar(20);