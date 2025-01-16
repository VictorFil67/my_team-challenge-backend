import Voting from "../models/Voting.js";

export async function addVoting(data) {
  return Voting.create(data);
}
