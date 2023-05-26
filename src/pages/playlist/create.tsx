import { type NextPage } from "next";
import { type z } from "zod";
import { type CreatePlaylistInput } from "../../server/api/routers/playlist";

type FormInputs = z.infer<typeof CreatePlaylistInput>;

const CreatePlaylist: NextPage = () => {
  return <></>;
};

export default CreatePlaylist;
