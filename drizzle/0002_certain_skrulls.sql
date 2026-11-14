DROP INDEX `person_slug_unique`;--> statement-breakpoint
ALTER TABLE `person` DROP COLUMN `slug`;--> statement-breakpoint
ALTER TABLE `site` ADD `artist_person_id` integer NOT NULL REFERENCES person(id);--> statement-breakpoint
ALTER TABLE `site` DROP COLUMN `artist_name`;--> statement-breakpoint
ALTER TABLE `site` DROP COLUMN `bio`;