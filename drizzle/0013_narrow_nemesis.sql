ALTER TABLE `ruCashProducts` ADD `paymentProvider` varchar(32) DEFAULT 'xsolla' NOT NULL;--> statement-breakpoint
ALTER TABLE `ruCashProducts` ADD `currency` varchar(10) DEFAULT 'USD' NOT NULL;