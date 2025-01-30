import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import {
  findNewsChannel,
  findNewsChannelById,
} from "../services/newsChannelServices.js";
import {
  addReactionById,
  findNewsById,
  getNewsList,
  makeNews,
  removeNewsById,
} from "../services/newsServies.js";

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

const addReaction = async (req, res) => {
  const { is_admin, buildings, _id } = req.user;
  const { reaction } = req.body;
  const { newsId } = req.params;

  const { news_channel_id, reactions } = await findNewsById({ _id: newsId });
  console.log("reactions from DB: ", reactions);
  const { residential_complex_id, building_id } = await findNewsChannelById({
    _id: news_channel_id,
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

  const userReaction = reactions.find(
    (elem) => elem.userId?.toString() === _id.toString()
  );
  console.log("reaction: ", reaction);
  console.log("userReaction: ", userReaction);

  if (userReaction && reaction === userReaction.reaction) {
    throw HttpError(
      403,
      "You allready have such a reaction. You can only change it."
    );
  }

  const newReaction = { reaction, userId: _id };
  console.log("newReaction: ", newReaction);
  if (!userReaction) {
    reactions.push(newReaction);
    console.log("reactions for no: ", reactions);
  } else {
    const reactionIndex = reactions.findIndex(
      (elem) => elem.userId?.toString() === _id.toString()
    );
    reactions.splice(reactionIndex, 1, newReaction);
    console.log("reactions for exists: ", reactions);
  }
  console.log("reactions: ", reactions);
  // const newReactions = userReaction
  //   ? reactions.splice(reactionIndex, 1, newReaction)
  //   : reactions.push(newReaction);
  // console.log("newReactions: ", newReactions);
  const result = await addReactionById({ _id: newsId }, { reactions });

  res.json(result);
};

const deleteNews = async (req, res) => {
  const { newsId: _id } = req.params;
  const result = await removeNewsById(_id);
  res.json(result);
};

export default {
  createNews: ctrlWrapper(createNews),
  getNews: ctrlWrapper(getNews),
  addReaction: ctrlWrapper(addReaction),
};
