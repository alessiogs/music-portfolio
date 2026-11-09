CREATE TABLE `asset` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`storage_key` text NOT NULL,
	`original_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`sha256` text NOT NULL,
	`width` integer,
	`height` integer,
	`duration_ms` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `asset_storageKey_unique` ON `asset` (`storage_key`);--> statement-breakpoint
CREATE TABLE `site` (
	`id` integer PRIMARY KEY NOT NULL,
	`artist_name` text NOT NULL,
	`tagline` text,
	`bio` text,
	`avatar_asset_id` integer,
	`links` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`avatar_asset_id`) REFERENCES `asset`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "site_singleton" CHECK("site"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE `person` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`bio` text,
	`url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `person_slug_unique` ON `person` (`slug`);--> statement-breakpoint
CREATE TABLE `project` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`kind` text NOT NULL,
	`bio` text,
	`active_from` text,
	`active_to` text,
	`cover_asset_id` integer,
	`position` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`cover_asset_id`) REFERENCES `asset`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "project_active_from_format" CHECK(
	"project"."active_from" IS NULL
	OR "project"."active_from" GLOB '[0-9][0-9][0-9][0-9]'
	OR "project"."active_from" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]'
	OR "project"."active_from" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]-[0-3][0-9]'
),
	CONSTRAINT "project_active_to_format" CHECK(
	"project"."active_to" IS NULL
	OR "project"."active_to" GLOB '[0-9][0-9][0-9][0-9]'
	OR "project"."active_to" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]'
	OR "project"."active_to" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]-[0-3][0-9]'
)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_slug_unique` ON `project` (`slug`);--> statement-breakpoint
CREATE TABLE `project_member` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`person_id` integer NOT NULL,
	`role` text,
	`active_from` text,
	`active_to` text,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `project_member_project_idx` ON `project_member` (`project_id`);--> statement-breakpoint
CREATE INDEX `project_member_person_idx` ON `project_member` (`person_id`);--> statement-breakpoint
CREATE TABLE `song` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`audio_asset_id` integer,
	`written_on` text,
	`produced_on` text,
	`lyrics` text,
	`notes` text,
	`downloadable` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`audio_asset_id`) REFERENCES `asset`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "song_written_on_format" CHECK(
	"song"."written_on" IS NULL
	OR "song"."written_on" GLOB '[0-9][0-9][0-9][0-9]'
	OR "song"."written_on" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]'
	OR "song"."written_on" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]-[0-3][0-9]'
),
	CONSTRAINT "song_produced_on_format" CHECK(
	"song"."produced_on" IS NULL
	OR "song"."produced_on" GLOB '[0-9][0-9][0-9][0-9]'
	OR "song"."produced_on" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]'
	OR "song"."produced_on" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]-[0-3][0-9]'
)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `song_project_slug_idx` ON `song` (`project_id`,`slug`);--> statement-breakpoint
CREATE TABLE `song_credit` (
	`song_id` integer NOT NULL,
	`person_id` integer NOT NULL,
	`role` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`song_id`, `person_id`, `role`),
	FOREIGN KEY (`song_id`) REFERENCES `song`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`person_id`) REFERENCES `person`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `song_credit_person_idx` ON `song_credit` (`person_id`);--> statement-breakpoint
CREATE TABLE `release` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`kind` text NOT NULL,
	`released_on` text,
	`description` text,
	`artwork_asset_id` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`artwork_asset_id`) REFERENCES `asset`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "release_released_on_format" CHECK(
	"release"."released_on" IS NULL
	OR "release"."released_on" GLOB '[0-9][0-9][0-9][0-9]'
	OR "release"."released_on" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]'
	OR "release"."released_on" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]-[0-3][0-9]'
)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `release_project_slug_idx` ON `release` (`project_id`,`slug`);--> statement-breakpoint
CREATE TABLE `release_track` (
	`release_id` integer NOT NULL,
	`song_id` integer NOT NULL,
	`disc` integer DEFAULT 1 NOT NULL,
	`position` integer NOT NULL,
	PRIMARY KEY(`release_id`, `song_id`),
	FOREIGN KEY (`release_id`) REFERENCES `release`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`song_id`) REFERENCES `song`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `release_track_song_idx` ON `release_track` (`song_id`);--> statement-breakpoint
CREATE TABLE `photo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`asset_id` integer NOT NULL,
	`project_id` integer,
	`description` text,
	`taken_on` text,
	`photographer_id` integer,
	`position` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`asset_id`) REFERENCES `asset`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`photographer_id`) REFERENCES `person`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "photo_taken_on_format" CHECK(
	"photo"."taken_on" IS NULL
	OR "photo"."taken_on" GLOB '[0-9][0-9][0-9][0-9]'
	OR "photo"."taken_on" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]'
	OR "photo"."taken_on" GLOB '[0-9][0-9][0-9][0-9]-[01][0-9]-[0-3][0-9]'
)
);
--> statement-breakpoint
CREATE INDEX `photo_project_idx` ON `photo` (`project_id`);