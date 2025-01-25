import {
  findNewsChannel,
  findNewsChannelById,
} from "../services/newsChannelServices.js";
import { makenews } from "../services/newsServies.js";

const createNews = async (req, res) => {
  const { is_admin, buildings } = req.user;
  const { newsChannelId: _id } = req.params;

  const { residential_complex_id } = await findNewsChannelById(_id);
  let is_moderator;
  if (!is_admin) {
    const { moderator } = buildings.find(
      (elem) =>
        elem.residential_complex_id.toString() ===
        residential_complex_id.toString()
    );
    is_moderator = moderator;
  }

  if (!is_admin && !is_moderator) {
    throw HttpError(403, "You don't have access to this action!");
  }

  const newNews = await makenews({
    ...req.body,
    news_channel_id: _id,
    reaction: [],
  });
  res.status(201).json(newNews);
};
