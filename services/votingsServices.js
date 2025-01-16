import Voting from "../models/Voting";

export async function addVoting(data) {
  return Voting.create(data);
}
