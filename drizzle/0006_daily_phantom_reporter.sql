CREATE TABLE `ruCashBalances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`ruCash` int NOT NULL DEFAULT 0,
	`bonusCash` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ruCashBalances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ruCashProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`priceUsd` decimal(10,2) NOT NULL,
	`ruCashAmount` int NOT NULL DEFAULT 0,
	`bonusCashAmount` int NOT NULL DEFAULT 0,
	`imageUrl` text,
	`isActive` int NOT NULL DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ruCashProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ruCashTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('charge','use') NOT NULL,
	`gameCode` varchar(32) NOT NULL DEFAULT 'ROU',
	`beforeRuCash` int NOT NULL DEFAULT 0,
	`beforeBonusCash` int NOT NULL DEFAULT 0,
	`ruCashDelta` int NOT NULL DEFAULT 0,
	`bonusCashDelta` int NOT NULL DEFAULT 0,
	`afterRuCash` int NOT NULL DEFAULT 0,
	`afterBonusCash` int NOT NULL DEFAULT 0,
	`productId` int,
	`pgName` varchar(64),
	`priceUsd` decimal(10,2),
	`itemName` varchar(255),
	`itemQty` int DEFAULT 1,
	`itemPriceRuc` int DEFAULT 0,
	`totalPriceRuc` int DEFAULT 0,
	`transactionId` varchar(128),
	`status` enum('completed','failed','pending') NOT NULL DEFAULT 'completed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ruCashTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `news` ADD `sortOrder` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `ruCashBalances` ADD CONSTRAINT `ruCashBalances_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ruCashTransactions` ADD CONSTRAINT `ruCashTransactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ruCashTransactions` ADD CONSTRAINT `ruCashTransactions_productId_ruCashProducts_id_fk` FOREIGN KEY (`productId`) REFERENCES `ruCashProducts`(`id`) ON DELETE no action ON UPDATE no action;