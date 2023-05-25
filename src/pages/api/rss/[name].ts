import { type NextApiHandler } from "next";

const rssHandler: NextApiHandler = async (req, res) => {
  const songId = req.query;
  res.send(`hello world ${JSON.stringify(req.query) || ""}`);
};
export default rssHandler;
