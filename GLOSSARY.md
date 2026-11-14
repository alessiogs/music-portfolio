# Music Portfolio

A self-hosted site where one artist publishes the music, credits and photos from all the projects they make music in.

## Site and people

**Site**:
The website itself: it names which Person is the Artist and carries the tagline, avatar and links. The Artist's name and bio come from their Person, not from the Site.
_Avoid_: Portfolio, profile, instance

**Admin**:
The login that manages the Site through the CMS. Usually the Artist, but not by definition.
_Avoid_: User, owner

**Listener**:
Anyone using the public Site. Listeners have no account.
_Avoid_: User, visitor, fan

**Artist**:
The one Person a site belongs to.
_Avoid_: Owner, user, musician

**Person**:
Anyone who can be named on the site: the Artist, band mates, collaborators, producers, photographers.
_Avoid_: Contributor, member (when meaning any person), contact, profile (Persons have no page of their own)

**Member**:
A Person's stint in a Project, with what they did there and when. Leaving and rejoining makes two Memberships, and the Artist is a Member of each of their Projects like anyone else.
_Avoid_: Band mate, lineup entry

## Music

**Project**:
A band or solo act the Artist releases music under. A Project's kind is either band or solo, and a past band the Artist has left is still a Project.
_Avoid_: Act, artist, group, band (as the general term)

**Song**:
A composition (words and music) as written for one Project, independent of any particular recording of it. The same composition played by two Projects is two Songs, and a Song may have no Recordings yet.
_Avoid_: Track, tune, piece

**Cover**:
A Song the Artist did not write, credited to the outside Persons who did.
_Avoid_: Cover version (as a separate kind of thing)

**Recording**:
One specific audio version of a Song. Its kind is studio, demo or live, and an optional version label ("Acoustic", "Radio edit") tells apart Recordings of the same kind.
_Avoid_: Track, version, take, audio

**Demo**:
A Recording of kind demo: a rough or early version, whether or not it is on a Release.
_Avoid_: Unreleased song (a demo can be released; an unreleased Recording need not be a demo)

**Unreleased**:
Said of a Recording that is not on any Release.
_Avoid_: Demo, draft

**Release**:
A collection of Recordings put out by one Project, such as an album, EP, single, live album or compilation. Every Recording on it belongs to that same Project.
_Avoid_: Album (as the general term), record

**Track**:
A Recording's place on a Release: its disc and number. A Recording can be a Track on several Releases, but only once on each.
_Avoid_: Track (as a synonym for Song or Recording)

**Main Recording**:
The Recording that plays when a Song itself is played. The Artist can choose it; otherwise it is the newest released studio Recording, then any Recording.
_Avoid_: Default version, primary track

## Credits

**Credit**:
A Person's named contribution to a Song (lyricist, composer) or to a Recording (producer, mixing engineer, mastering engineer, performer).
_Avoid_: Role (alone), contribution

**Written by**:
How a Credit is shown when the same Person is both lyricist and composer of a Song.
_Avoid_: Writer (as a stored role)

**Performer**:
A Credit on a Recording for someone who played or sang on it, with a short description of what they did ("guest vocals", "cello"). Being a Performer does not make someone a Member.
_Avoid_: Guest, featuring, session musician

## Photos

**Photo**:
A picture in a Gallery, optionally with a description, a date and a "Photo by" naming the Person who took it. Release artwork is not a Photo.
_Avoid_: Image, picture, photo credit (Credit is reserved for Songs and Recordings)

**Gallery**:
The set of Photos of one Project, or of the Artist.
_Avoid_: Album, photo set

## Listening

**Download**:
A Listener getting a Recording as a file to keep outside the Site. Possible only for Recordings the Artist has marked downloadable.
_Avoid_: Save, export

**Saved offline**:
Said of content a Listener's browser keeps so the Site and player work without a connection. Any Published Recording can be Saved offline, downloadable or not.
_Avoid_: Downloaded, cached

## Dates

**Fuzzy date**:
A date known only as precisely as the Artist remembers it: a year, a year and month, or a full day.
_Avoid_: Partial date, approximate date

## Publishing

**Draft**:
Content only the Artist can see while working on it.
_Avoid_: Hidden, private, unreleased

**Published**:
Content marked as ready for the public. It is actually visible only when everything it hangs off is Published too: a Recording needs its Song and Project, a Release needs its Project and all of its Recordings.
_Avoid_: Live (that is a Recording and Release kind), released, public
