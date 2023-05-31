-- CreateEnum
CREATE TYPE "FeedItunesType" AS ENUM ('episodic', 'serial');

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "siteUrl" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "generator" TEXT NOT NULL DEFAULT 'Code-ga Podcast Admin Dashboard',
    "docs" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "managingEditor" TEXT NOT NULL,
    "webMaster" TEXT NOT NULL,
    "copyright" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'vi',
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pubDate" TIMESTAMP(3) NOT NULL,
    "geoRSS" BOOLEAN NOT NULL DEFAULT false,
    "itunesAuthor" TEXT NOT NULL,
    "itunesSubtitle" TEXT NOT NULL,
    "itunesSummary" TEXT NOT NULL,
    "itunesOwnerID" TEXT NOT NULL,
    "itunesExplicit" BOOLEAN NOT NULL,
    "itunesImage" TEXT NOT NULL,
    "itunesType" "FeedItunesType" NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedItunesOwner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "FeedItunesOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedItunesCategory" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "subcatsID" TEXT[],
    "playlistId" TEXT,
    "feedItunesCategoryId" TEXT,

    CONSTRAINT "FeedItunesCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_itunesOwnerID_fkey" FOREIGN KEY ("itunesOwnerID") REFERENCES "FeedItunesOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedItunesCategory" ADD CONSTRAINT "FeedItunesCategory_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
