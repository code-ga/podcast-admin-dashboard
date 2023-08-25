// "use client";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GetPlaylist } from "~/util/getPlaylist";
import { ShowPlaylistField } from "../../../components/ShowPlaylistInfoField";

export default async function PlaylistInfo(routeParams: {
  params: { id: string };
  searchParams: {};
}) {
  const playlist = await GetPlaylist(routeParams.params.id);

  if (!playlist) notFound();

  return (
    <div className="grid grid-cols-4 gap-1 pt-5">
      <div className="col-span-3 p-4 rounded-lg">
        <ShowPlaylistField playlist={playlist}></ShowPlaylistField>
      </div>
      <div className="flex items-center justify-center p-4 text-center rounded-lg ">
        <Image
          src={playlist.imageUrl}
          alt=""
          width={100}
          height={100}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}

