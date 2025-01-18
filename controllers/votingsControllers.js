import ctrlWrapper from "../decorators/ctrlWrapper.js";
import HttpError from "../helpers/HttpError.js";
import {
  addVote,
  addVoting,
  findVotingById,
  votingsList,
} from "../services/votingsServices.js";

const createVoting = async (req, res) => {
  const { is_admin, buildings } = req.user;
  const { residential_complex_id } = req.params;

  const searchComplex = buildings.find((elem) => {
    return (
      elem.residential_complex_id.toString() ===
      residential_complex_id.toString()
    );
  });

  if (!is_admin && !searchComplex) {
    throw HttpError(404, `The user is not related to the specified complex.`);
  }

  const moderator = is_admin ? false : searchComplex.moderator;
  console.log(moderator);
  if (!is_admin && !moderator) {
    throw HttpError(403, "You don't have access to this action!");
  }

  const result = await addVoting({ ...req.body, votedUsers: [] });
  console.log(result);
  res.status(201).json(result);
};

const getVotings = async (req, res) => {
  const { _id } = req.user;

  const {
    page = 1,
    limit = 20,
    displayType = "Number",
    status = "",
  } = req.query;
  const skip = (page - 1) * limit;

  const data = await votingsList({ skip, limit, status });

  const result = data.map((item) => {
    const votedUser = item.votedUsers.find(
      (user) => user._id.toString() === _id.toString()
    );

    item.votedUsers = votedUser;
    return item;
  });

  const finalResult = result.map((item) => {
    if (item.displayType === "Percentages") {
      const total = item.options.reduce(
        (akk, option) => akk + option.quantity,
        0
      );

      const optionsInPercents = item.options.map((option) => {
        const percentQuantity = Math.round((option.quantity / total) * 100);
        option.quantity = percentQuantity;
        return option;
      });
      item.options = optionsInPercents;
    }

    return item;
  });

  res.json(finalResult);
};

const vote = async (req, res) => {
  const { _id } = req.user;
  const { votingId } = req.params;
  const { options } = req.body;

  const trueOptions = options.filter((option) => option.quantity === true);
  const userOptions = trueOptions.map((option) => {
    option.isVote = option.quantity;
    return option;
  });
  const userVote = { _id, votedUserOptions: userOptions };

  const { options: oldOptions, votedUsers } = await findVotingById({
    _id: votingId,
  });
  //the first variant
  const votedUser = votedUsers.find(
    (user) => user._id.toString() === _id.toString()
  );
  console.log(votedUser);
  if (votedUser) {
    throw HttpError(
      403,
      "You don't have access to this action, because you have already voted!"
    );
  }
  //the second variant
  const isVotedUser = votedUsers.findIndex(
    (user) => user._id.toString() === _id.toString()
  );
  console.log(isVotedUser);
  if (isVotedUser > -1) {
    throw HttpError(
      403,
      "You don't have access to this action, because you have already voted!"
    );
  }
  // ----------------------
  votedUsers.push(userVote);
  const voteQuantities = options.map(
    (option) => (option.quantity = option.quantity ? 1 : 0)
  );

  console.log(voteQuantities);
  const optionsAfterVoting = oldOptions.map((oldOption, idx) => {
    const newQuantity = oldOption.quantity + voteQuantities[idx];

    //the first variant
    oldOption.quantity = newQuantity;
    return oldOption;
    //the second variant
    // const newOption = { ...oldOption, quantity: newQuantity };
    // console.log(newOption._doc);
    // return newOption._doc;
  });

  const result = await addVote(
    { _id: votingId },
    { options: optionsAfterVoting, votedUsers }
  );

  if (result.displayType === "Percentages") {
    const total = result.options.reduce(
      (akk, option) => akk + option.quantity,
      0
    );
    console.log(total);
    const optionsInPercents = result.options.map((option) => {
      const percentQuantity = Math.round((option.quantity / total) * 100);
      option.quantity = percentQuantity;
      return option;
    });
    result.options = optionsInPercents;
  }

  res.json(result);
};

export default {
  createVoting: ctrlWrapper(createVoting),
  getVotings: ctrlWrapper(getVotings),
  vote: ctrlWrapper(vote),
};
