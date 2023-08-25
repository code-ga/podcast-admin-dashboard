import { FeedItunesType } from "@prisma/client";
import { prisma } from "~/db";

type PodcastInfo = {
  title: string;
  description: string;
  podcastAuthor: string;
  podcastThumbnail: string;
  podcastAuthorEmail: string;
  docs?: string;
  itunesExplicit?: boolean;
  itunesSubtitle?: string;
  itunesSummary?: string;
  itunesType?: FeedItunesType;
  categories?: string[];
  generator?: string;
  geoRSS?: boolean;
  language?: string;
};
export async function createPodcastAPI(data: PodcastInfo) {
  "use server";
  return await prisma.playlist.create({
    data: {
      author: data.podcastAuthor,
      copyright: data.podcastAuthor,
      description: data.description,
      docs: data.docs || "",
      imageUrl: data.podcastThumbnail,
      itunesAuthor: data.podcastAuthor,
      itunesExplicit:
        data.itunesExplicit == undefined ? false : data.itunesExplicit,
      itunesImage: data.podcastThumbnail,
      itunesSubtitle: data.itunesSubtitle || "",
      itunesSummary: data.itunesSummary || data.description,
      itunesType: data.itunesType ?? "episodic",
      managingEditor: data.podcastAuthor,
      title: data.title,
      webMaster: data.podcastAuthor,
      itunesOwner: {
        connectOrCreate: {
          create: {
            email: data.podcastAuthorEmail,
            name: data.podcastAuthor,
          },
          where: {
            email: data.podcastAuthorEmail,
          },
        },
      },
      categories: data.categories,
      generator: data.generator,
      geoRSS: data.geoRSS,
      language: data.language,
    },
  });
}
export default async function CreatePlaylist() {
  const PodcastAuthor = "Code-ga";
  const PodcastAuthorEmail = "code-ga@gmail.com";
  const PodcastThumbnail = "https://cdn.discordapp.com/embed/avatars/2.png";
  const playlist = await createPodcastAPI({
    title: "code-ga Podcast",
    description: "the funny code-ga podcast",
    podcastAuthor: PodcastAuthor,
    podcastAuthorEmail: PodcastAuthorEmail,
    podcastThumbnail: PodcastThumbnail,
  });
  return <div>{playlist.id}</div>;
}
