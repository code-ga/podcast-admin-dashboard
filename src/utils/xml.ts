import z from "zod"
import { CreatePlaylistDBSaveType } from "~/server/api/routers/playlist";
import { Podcast } from "podcast"
export function RSSFromObj(obj:z.infer<typeof CreatePlaylistDBSaveType>) {
  const feed = new Podcast({
    title: obj.title,
    description: obj.description,
    feedUrl: obj["atom:link"],
    siteUrl: obj.link,
    imageUrl: obj.image,
    docs: obj.docs || undefined ,
    author: obj.author,
    managingEditor: obj.author,
    webMaster: obj.author,
    copyright: obj.copyright,
    language: obj.language,
    categories: obj.category,
    pubDate: obj.lastBuildDate,
    itunesAuthor: obj["itunes:author"],
    itunesSubtitle: obj.itunesSubtitle,
    itunesSummary: obj["itunes:summary"],
    itunesOwner: {
      name: obj["itunes:owner"]["itunes:name"],
      email: obj["itunes:owner"]["itunes:email"]
    },
    itunesExplicit: obj["itunes:explicit"] == "Yes",
    itunesCategory: obj.itunesCategory,
    itunesImage: obj["itunes:image"]
  }); 
  return feed.buildXml()
}
