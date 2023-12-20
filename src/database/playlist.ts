"use server";

import { prisma } from "../db";

export async function updatePlaylist(id: string, data: Record<string, any>) {

    return await prisma.playlist.update({
        where: {
            id,
        },
        data,
    });
}