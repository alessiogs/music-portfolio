import { relations } from 'drizzle-orm';
import { asset } from './asset';
import { person } from './person';
import { photo } from './photo';
import { project, projectMember } from './project';
import { release, releaseTrack } from './release';
import { site } from './site';
import { song, songCredit } from './song';

export const siteRelations = relations(site, ({ one }) => ({
	avatar: one(asset, { fields: [site.avatarAssetId], references: [asset.id] })
}));

export const personRelations = relations(person, ({ many }) => ({
	memberships: many(projectMember),
	credits: many(songCredit)
}));

export const projectRelations = relations(project, ({ one, many }) => ({
	cover: one(asset, { fields: [project.coverAssetId], references: [asset.id] }),
	members: many(projectMember),
	releases: many(release),
	songs: many(song),
	photos: many(photo)
}));

export const projectMemberRelations = relations(projectMember, ({ one }) => ({
	project: one(project, { fields: [projectMember.projectId], references: [project.id] }),
	person: one(person, { fields: [projectMember.personId], references: [person.id] })
}));

export const releaseRelations = relations(release, ({ one, many }) => ({
	project: one(project, { fields: [release.projectId], references: [project.id] }),
	artwork: one(asset, { fields: [release.artworkAssetId], references: [asset.id] }),
	tracks: many(releaseTrack)
}));

export const releaseTrackRelations = relations(releaseTrack, ({ one }) => ({
	release: one(release, { fields: [releaseTrack.releaseId], references: [release.id] }),
	song: one(song, { fields: [releaseTrack.songId], references: [song.id] })
}));

export const songRelations = relations(song, ({ one, many }) => ({
	project: one(project, { fields: [song.projectId], references: [project.id] }),
	audio: one(asset, { fields: [song.audioAssetId], references: [asset.id] }),
	credits: many(songCredit),
	appearsOn: many(releaseTrack)
}));

export const songCreditRelations = relations(songCredit, ({ one }) => ({
	song: one(song, { fields: [songCredit.songId], references: [song.id] }),
	person: one(person, { fields: [songCredit.personId], references: [person.id] })
}));

export const photoRelations = relations(photo, ({ one }) => ({
	asset: one(asset, { fields: [photo.assetId], references: [asset.id] }),
	project: one(project, { fields: [photo.projectId], references: [project.id] }),
	photographer: one(person, { fields: [photo.photographerId], references: [person.id] })
}));
