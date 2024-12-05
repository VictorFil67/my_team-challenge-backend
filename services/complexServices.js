import Complex from "../models/Comlex.js";

export async function addComplex(data) {
  return await Complex.create(data);
}

export async function findComplex(filter) {
  return await Complex.findOne(filter);
}
