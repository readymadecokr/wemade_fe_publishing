ALTER TABLE `coupons` DROP INDEX `coupons_code_unique`;--> statement-breakpoint
ALTER TABLE `couponUses` ADD `serverCode` varchar(32);--> statement-breakpoint
ALTER TABLE `couponUses` ADD `characterName` varchar(128);--> statement-breakpoint
ALTER TABLE `couponUses` ADD `couponCodeSnapshot` varchar(64);--> statement-breakpoint
ALTER TABLE `coupons` ADD `gameCode` varchar(32) DEFAULT 'ROU' NOT NULL;--> statement-breakpoint
ALTER TABLE `coupons` ADD `couponType` enum('common','random') DEFAULT 'common' NOT NULL;--> statement-breakpoint
ALTER TABLE `coupons` ADD `eventName` varchar(20) DEFAULT 'Legacy Coupon' NOT NULL;--> statement-breakpoint
ALTER TABLE `coupons` ADD `bonusRcoin` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `coupons` ADD `rewardItems` text;--> statement-breakpoint
ALTER TABLE `coupons` ADD `serverCodes` varchar(255);--> statement-breakpoint
ALTER TABLE `coupons` ADD `validFrom` timestamp;--> statement-breakpoint
ALTER TABLE `coupons` ADD `randomGenerated` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `coupons` ADD CONSTRAINT `coupons_code_eventName_unique` UNIQUE(`code`,`eventName`);