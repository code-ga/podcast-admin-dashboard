import { type NextApiHandler } from "next";
import { GetRssFromID } from "~/utils/getRssFromID";

const rssHandler: NextApiHandler = async (req, res) => {
  let playlistID = req.query.id;
  if (!playlistID) {
    res.status(400).json({
      status: 400,
      message: "nothing in here",
    });
    return;
  }
  if (playlistID instanceof Array) {
    if (playlistID.length > 1) {
      res.status(400).json({
        status: 400,
        message: "nothing here again",
        params: playlistID,
      });
      return;
    } else {
      playlistID = playlistID[0] || "";
    }
  }
  const result = await GetRssFromID(playlistID);
  if (!result) {
    res.status(404).json({
      status: 404,
      message: "nothing here",
    });
  }
  res.send(result);
};
export default rssHandler;
