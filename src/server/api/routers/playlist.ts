import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { uuidv4 } from "~/utils/uuid";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { kv } from "@vercel/kv";
import { TRPCError } from "@trpc/server";

export const CreatePlaylistInput = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  generator: z.string().default("Podcast Admin Dashboard"),
  lastBuildDate: z.date().default(new Date()),
  author: z.string(),
  copyright: z.string(),
  language: z.string().default("vi"),
  "itunes:explicit": z.enum(["Yes", "No"]).default("No"),
  link: z.string().default(getBaseUrl()),
  category: z.array(z.string()).default([]),
  itunesSubtitle: z.string().default(""),
  itunesCategory: z.array(z.object({
    text: z.string(),
    subcats: z.array(z.object({
      text: z.string()
    }))
  })).default([])
});

export const updatePlaylistInput = CreatePlaylistInput.partial();

export const CreatePlaylistDBSaveType = CreatePlaylistInput.extend({
  "atom:link": z.string(),
  "itunes:author": z.string(),
  "itunes:summary": z.string(),
  "itunes:owner": z.object({
    "itunes:name": z.string(),
    "itunes:email": z.string(),
  }),
  "itunes:image": z.string(),
  docs: z.string().nullable()
});

export const playlistRouter = createTRPCRouter({
  create: publicProcedure
    .input(CreatePlaylistInput)
    .output(
      z.object({
        id: z.string(),
        createData: CreatePlaylistDBSaveType,
      })
    )
    .mutation(async ({ input }) => {
      const playlistID = uuidv4();
      const createData: z.infer<typeof CreatePlaylistDBSaveType> = CreatePlaylistDBSaveType.parse({
        ...input,
        "atom:link": `${getBaseUrl()}/api/rss/${playlistID}`,
        "itunes:author": input.author,
        "itunes:summary": input.description,
        "itunes:type": "episodic",
        "itunes:owner": {
          "itunes:name": input.author,
          "itunes:email": "<need from input>",
        },
        // itunes:category
        "itunes:image": input.image,
      });

      const kv_key = `playlist_${playlistID}`;
      await kv.hset(kv_key, createData);
      await kv.rpush("playlists", kv_key);
      return {
        id: playlistID,
        createData,
      };
    }),
  getAllPlaylist: publicProcedure.query(async () => {
    return (await kv.get<string[]>("playlists")) ?? [];
  }),
  getPlaylistById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await kv.hgetall<z.infer<typeof CreatePlaylistDBSaveType>>(
        `playlist_${input.id}`
      );
    }),
  editPlaylistInfo: publicProcedure.input(z.object({
    id: z.string(),
    input: updatePlaylistInput
  })).mutation(
    async ({ input }) => {
      const playlist = await kv.hgetall<z.infer<typeof CreatePlaylistDBSaveType>>(`playlist_${input.id}`)
      if (!playlist) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Playlist Not Found"
        })
      }
      await kv.hset(`playlist_${input.id}`, input.input)
      return {
        id: input.id,
        data: { ...playlist, ...input.input }
      }
    }
  )
});
