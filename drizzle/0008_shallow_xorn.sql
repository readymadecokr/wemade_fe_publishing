CREATE TABLE `memberRestrictionHistories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('active','suspended','banned') NOT NULL,
	`csCode` varchar(32),
	`reason` text,
	`suspendedUntil` timestamp,
	`appliedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `memberRestrictionHistories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `memberRestrictionHistories` ADD CONSTRAINT `memberRestrictionHistories_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;