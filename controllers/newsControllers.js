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

  const newsChannel = await findNewsChannelById(_id);
  if (!newsChannel) {
    throw HttpError(404, "Such news Channel does not exist");
  }
  let is_moderator;
  if (!is_admin) {
    const { moderator } = buildings.find(
      (elem) =>
        elem.residential_complex_id.toString() ===
        newsChannel.residential_complex_id.toString()
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
  // console.log("reactions from DB: ", reactions);
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
  const existedIncomeReaction = reactions.find(
    (elem) => elem.reaction === reaction
  );
  console.log("existedIncomeReaction: ", existedIncomeReaction);
  const otherUserReaction = reactions.find(
    (elem) => elem.userIds.includes(_id) && elem.reaction !== reaction
  );
  console.log("otherUserReaction: ", otherUserReaction);
  let newReaction = {};
  let existedUserIdForIncomeReaction;
  if (!existedIncomeReaction && !otherUserReaction) {
    newReaction = { reaction, userIds: [_id] };
    reactions.push(newReaction);
    console.log("reactions after newReaction: ", reactions);
  } else if (existedIncomeReaction && !otherUserReaction) {
    existedUserIdForIncomeReaction =
      existedIncomeReaction.userIds.includes(_id);
    if (existedUserIdForIncomeReaction) {
      throw HttpError(
        403,
        "You allready have such a reaction. You can only change it."
      );
    } else {
      existedIncomeReaction.userIds.push(_id);
      const userReactionIndex = reactions.findIndex(
        (elem) => (elem.reaction = reaction)
      );
      reactions.splice(userReactionIndex, 1, existedIncomeReaction);
      console.log(
        "reactions for userReaction && !otherUserReaction after add userId: ",
        reactions
      );
    }
  }
  // else if (condition) {
  // }
  // {
  // }
  // let existedUserIdForReaction;

  // let newReaction = {};
  // if (userReaction) {
  //   existedUserIdForReaction = userReaction.userIds.includes(_id);
  // } else {
  //   newReaction = { reaction, userIds: [_id] };
  //   reactions.push(newReaction);
  //   console.log("newReaction: ", newReaction);
  //   console.log("reactions: ", reactions);
  // }
  // if (existedUserIdForReaction) {
  //   throw HttpError(
  //     403,
  //     "You allready have such a reaction. You can only change it."
  //   );
  // } else if (!existedUserIdForReaction && userReaction) {
  //   console.log("before");
  //   console.log("userReaction: ", userReaction);
  //   console.log("after");
  //   userReaction.userIds.push(_id);
  //   const userReactionIndex = reactions.findIndex(
  //     (elem) => (elem.reaction = reaction)
  //   );
  //   reactions.splice(userReactionIndex, 1, userReaction);
  // }
  // // const otherUserReaction = reactions.find((elem) =>
  // //   elem.userIds.includes(_id)
  // // );
  // if (otherUserReaction) {
  //   console.log("before");
  //   console.log("otherUserReaction: ", otherUserReaction);
  //   const otherUserReactionIndex = reactions.findIndex((elem) =>
  //     elem.userIds.includes(_id)
  //   );
  //   const userIdIndex = otherUserReaction.userIds.indexOf(_id);
  //   otherUserReaction.userIds.splice(userIdIndex, 1);
  //   console.log("after");
  //   console.log("otherUserReaction: ", otherUserReaction);
  //   reactions.splice(otherUserReactionIndex, 1, otherUserReaction);
  // }
  // // const userReaction = reactions.find(
  // //   (elem) => elem.userId?.toString() === _id.toString()
  // // );
  // console.log("reaction: ", reaction);
  // console.log("userReaction: ", userReaction);

  // if (userReaction && reaction === userReaction.reaction) {
  //   throw HttpError(
  //     403,
  //     "You allready have such a reaction. You can only change it."
  //   );
  // }

  // const newReaction = { reaction, userId: _id };

  // if (!userReaction) {
  //   reactions.push(newReaction);
  //   console.log("reactions for no: ", reactions);
  // } else {
  //   const reactionIndex = reactions.findIndex(
  //     (elem) => elem.userId?.toString() === _id.toString()
  //   );
  //   reactions.splice(reactionIndex, 1, newReaction);
  //   console.log("reactions for exists: ", reactions);
  // }
  // console.log("reactions: ", reactions);
  // const newReactions = userReaction
  //   ? reactions.splice(reactionIndex, 1, newReaction)
  //   : reactions.push(newReaction);
  // console.log("newReactions: ", newReactions);
  const result = await addReactionById({ _id: newsId }, { reactions });

  res.json(result);
};

const deleteNews = async (req, res) => {
  const { is_admin, buildings } = req.user;
  const { newsId: _id } = req.params;

  // const { news_channel_id } = await findNewsById(_id);
  const news = await findNewsById(_id);
  console.log("news: ", news);
  if (!news) {
    throw HttpError(404, "Such news does not exist");
  }
  // console.log("news_channel_id: ", news_channel_id);
  const { residential_complex_id } = await findNewsChannelById({
    _id: news.news_channel_id,
  });
  console.log("residential_complex_id: ", residential_complex_id);
  const { moderator } = buildings.find(
    (elem) =>
      elem.residential_complex_id.toString() ===
      residential_complex_id.toString()
  );

  if (!is_admin && !moderator) {
    throw HttpError(403, "You don't have access to this action!");
  }

  const result = await removeNewsById(_id);
  res.json(result);
};

export default {
  createNews: ctrlWrapper(createNews),
  getNews: ctrlWrapper(getNews),
  addReaction: ctrlWrapper(addReaction),
  deleteNews: ctrlWrapper(deleteNews),
};
