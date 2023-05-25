import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const playlistRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        image: z.object({
          url: z.string(),
          title: z.string(),
        }),
        generator: z.string().default("Podcast Admin Dashboard"),
        lastBuildDate: z.date().default(new Date()),
      })
    )
    .mutation(({ input }) => {
        const createData = {
          ...input,
          "atom:link": "lastBuildDate",
        };
      return {
        greeting: ``,
      };
    }),
});
