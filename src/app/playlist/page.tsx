import { ShowPlaylistInfo } from "~/components/ShowPlaylist";
import { prisma } from "~/db";

async function GetPlaylists() {
  "use server";
  return await prisma.playlist.findMany({
    include: {
      itunesCategory: true,
      itunesOwner: true,
    },
  });
}

export default async function ListPlaylist() {
  const playlist = await GetPlaylists();
  return (
    <div>
      {playlist.map((e) => (
        <ShowPlaylistInfo playlist={e} key={e.id} />
      ))}
    </div>
  );
}
