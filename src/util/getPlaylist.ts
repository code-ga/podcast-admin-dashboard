"use server";

import { prisma } from "~/db";

export async function GetPlaylist(id: string) {
  return await prisma.playlist.findFirst({
    where: {
      id,
    },
    include: {
      itunesCategory: true,
      itunesOwner: true,
    },
  });
}
