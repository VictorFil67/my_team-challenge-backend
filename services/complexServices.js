import Complex from "../models/Comlex.js";

export async function addComplex(data) {
  return await Complex.create(data);
}

export async function findComplex(filter) {
  return await Complex.findOne(filter);
}

export async function updateComplexById(id, data) {
  return await Complex.findByIdAndUpdate(id, data);
}

export function getListOfComplexes() {
  return Complex.find();
}

export function findComplexById(id) {
  return Complex.findById(id);
}
