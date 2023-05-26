import { kv } from "@vercel/kv";
import type z from "zod";
import { type CreatePlaylistDBSaveType } from "~/server/api/routers/playlist";
import { OBJtoXML } from "./xml";

export async function GetRssFromID(playlist_id: string) {
  const playlist = await kv.get<z.infer<typeof CreatePlaylistDBSaveType>>(
    `playlist_${playlist_id}`
  );
  if (!playlist) return null;
  return OBJtoXML(playlist);
}
