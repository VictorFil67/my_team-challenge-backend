import ctrlWrapper from "../decorators/ctrlWrapper.js";
import {
  findNewsChannel,
  findNewsChannelById,
} from "../services/newsChannelServices.js";
import { getNewsList, makeNews } from "../services/newsServies.js";

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

  const newNews = await makeNews({
    ...req.body,
    news_channel_id: _id,
    reaction: [],
  });
  res.status(201).json(newNews);
};

const getNews = async (req, res) => {
  const { is_admin, buildings } = req.user;
  const { newsChannelId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const { residential_complex_id, building_id } = await findNewsChannelById({
    _id: newsChannelId,
  });

  const complex = buildings.find(
    (elem) =>
      elem.residential_complex_id.toString() ===
      residential_complex_id.toString()
  );

  if (!is_admin && !complex) {
    throw HttpError(403, "You don't have access to this action!");
  }
  let building;
  if (building_id) {
    building = complex.addresses.find((elem) => {
      if (elem.building_id) {
        return elem.building_id.toString() === building_id.toString();
      }
    });
  }

  if (!is_admin && building_id && !building) {
    throw HttpError(403, "You don't have access to this action!");
  }

  const result = await getNewsList(
    { news_channel_id: newsChannelId },
    { skip, limit }
  );

  res.send(result);
};

export default {
  createNews: ctrlWrapper(createNews),
  getNews: ctrlWrapper(getNews),
};
