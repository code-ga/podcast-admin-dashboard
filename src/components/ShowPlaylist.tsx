"use client"
import { FeedItunesCategory, FeedItunesOwner, Playlist } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export const ShowPlaylistInfo: React.FC<{
  playlist: Playlist & {
    itunesOwner: FeedItunesOwner;
    itunesCategory: FeedItunesCategory[];
  };
}> = ({ playlist }) => {
  return (
    <>
      <Link href={`/playlist/${playlist.id}`}>
      <div className="flex items-center justify-between mt-5 border rounded-lg">
        <p className="flex items-center">
          <Image
            src={playlist.imageUrl}
            alt={""}
            width={75}
            height={75}
            className="m-2.5 rounded-lg"
          ></Image>
          <div>
            <h1>{playlist.title}</h1>
            <h2>{playlist.description}</h2>
          </div>
        </p>
      </div>
    </Link></>
  );
};
