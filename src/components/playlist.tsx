import { api } from "~/utils/api";

export const ListPlaylist: React.FC<{ PlaylistIDs: string[] }> = ({
  PlaylistIDs,
}) => {
  return <></>;
};

export const PlaylistItem: React.FC<{ id: string }> = ({ id }) => {
    const playlist = api.playlist.getPlaylistById.useQuery({ id })
    if (playlist.error) {
        return <>Fetch Playlist Data Error</>
    }
    const playlistData = playlist.data
    if (!playlistData){
        return <>Server Error</>
    }
    return <></>
}