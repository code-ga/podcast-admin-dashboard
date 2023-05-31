import { FeedItunesCategory, FeedItunesOwner, Playlist } from "@prisma/client";

export const ShowPlaylistInfo: React.FC<{
  playlist: Playlist & {
    itunesOwner: FeedItunesOwner;
    itunesCategory: FeedItunesCategory[];
  };
}> = (props) => {
  return <></>;
};
