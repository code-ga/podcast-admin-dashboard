"use server";
import { NextResponse } from "next/server";
import { prisma } from "../../../../db";
import { Podcast } from "podcast";
import { SITE_URL } from "../../../../util/siteUrl";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  }
) {
  
  const playlistId = params.id; // 'a', 'b', or 'c'
  const playlist = await prisma.playlist.findUnique({
    where: {
      id: playlistId,
    },
    include: {
      itunesCategory: true,
      itunesOwner: true,
    },
  });
  if (!playlist) {
    return NextResponse.json(
      {
        status: 404,
        message: "not found",
      },
      {
        status: 404,
        statusText: "Not Found",
      }
    );
  }
  const feed = new Podcast({
    ...playlist,
    feedUrl: `${SITE_URL}/api/rss/${playlistId}`,

    namespaces: { iTunes: true, podcast: true },
  });

  return new NextResponse(feed.buildXml(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
