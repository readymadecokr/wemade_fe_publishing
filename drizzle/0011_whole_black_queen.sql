ALTER TABLE `banners` ADD `heroCategory` enum('EVENT','PROMO','UPDATE','NOTE') DEFAULT 'UPDATE' NOT NULL;--> statement-breakpoint
ALTER TABLE `banners` ADD `heroTitle` varchar(100);--> statement-breakpoint
ALTER TABLE `banners` ADD `heroDescription` varchar(255);