CREATE TABLE `banners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(512),
	`actionType` enum('url','content') NOT NULL DEFAULT 'url',
	`actionUrl` text,
	`contentTitle` varchar(255),
	`contentDate` varchar(50),
	`contentBody` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `banners_id` PRIMARY KEY(`id`)
);
