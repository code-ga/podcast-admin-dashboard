import { prisma } from "~/db";

const PodcastAuthor = "Code-ga";
const PodcastAuthorEmail = "code-ga@gmail.com";
const PodcastThumbnail = "https://cdn.discordapp.com/embed/avatars/2.png";
async () => {
  return await prisma.playlist.create({
    data: {
      author: PodcastAuthor,
      copyright: PodcastAuthor,
      description: "funny code-ga podcast",
      docs: "",
      imageUrl: PodcastThumbnail,
      itunesAuthor: PodcastAuthor,
      itunesExplicit: false,
      itunesImage: PodcastThumbnail,
      itunesSubtitle: "subtitle",
      itunesSummary: "the funny code-ga podcast",
      itunesType: "episodic",
      managingEditor: PodcastAuthor,
      title: "code-ga podcast",
      webMaster: PodcastAuthor,
      itunesOwner: {
        create: {
          email: PodcastAuthorEmail,
          name: PodcastAuthor,
        },
      },
    },
  });
};
export default function CreatePlaylist() {
  return <></>;
}
