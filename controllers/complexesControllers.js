import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { addComplex } from "../services/complexServices.js";

const createComplex = async (req, res) => {
  // const { addresses, apartmentsNumber } = req.body;

  //   const apartments = [];
  //   for (i = 1; (i = apartmentsNumber); i++) {
  //     apartments.push(i);
  //   }

  //   addresses.forEach((address) => {
  //     address.apartments.forEach((apartment) => {
  //       apartment.number = apartment;
  //     });
  //   });
  // const apartments = [apartmentsNumber];
  // const building = { addres: addresses, apartments };
  // console.log(building);
  //   const builgings = [building];
  // const buildings = [];
  // buildings.push(building);
  // console.log(buildings);
  const result = await addComplex(req.body);
  res.status(201).json(result);
};

export default { createComplex: ctrlWrapper(createComplex) };
