import Voting from "../models/Voting.js";

export async function addVoting(data) {
  return Voting.create(data);
}

export const votingsList = (query) => {
  const date = new Date();
  return query.status === "active"
    ? Voting.find({ endDate: { $gt: date } }, "", query)
    : Voting.find({ endDate: { $lte: date } }, "", query);
};
