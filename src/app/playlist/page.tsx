import { ShowPlaylistInfo } from "../../components/ShowPlaylist";
import { prisma } from "../../db";

export default async function ListPlaylist() {
  const playlist = await prisma.playlist.findMany({
    include: {
      itunesCategory: true,
      itunesOwner: true,
    },
  });
  return (
    <>
      {playlist.map((e) => (
        <ShowPlaylistInfo playlist={e} key={e.id} />
      ))}
    </>
  );
}
