import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { addComplex } from "../services/complexServices.js";

const createComplex = async (req, res) => {
  const { addresses, apartmentsNumber, entrances } = req.body;

  const apartmentNumbers = [];
  for (let i = 1; i <= apartmentsNumber; i += 1) {
    apartmentNumbers.push(i);
  }
  console.log(apartmentNumbers);
  const buildings = [];

  addresses.forEach((address) => {
    const building = {};
    building.apartments = [];
    // addresses.forEach((address) => {
    building.address = address;
    apartmentNumbers.forEach((apartmentNumber) => {
      const apartmentsPerEntrance = Math.ceil(apartmentsNumber / entrances);
      const apartment = {
        number: apartmentNumber,
        entrance:
          apartmentNumber <= apartmentsPerEntrance
            ? 1
            : apartmentNumber > apartmentsPerEntrance &&
              apartmentNumber <= 2 * apartmentsPerEntrance
            ? 2
            : apartmentNumber > 2 * apartmentsPerEntrance &&
              apartmentNumber <= 3 * apartmentsPerEntrance
            ? 3
            : apartmentNumber > 3 * apartmentsPerEntrance &&
              apartmentNumber <= 4 * apartmentsPerEntrance
            ? 5
            : 6,
      };
      building.apartments.push(apartment);
    });
    buildings.push(building);
  });
  console.log(buildings);
  // });
  // const apartments = [apartmentsNumber];
  // const building = { addres: addresses, apartments };
  // console.log(building);
  //   const builgings = [building];
  // const buildings = [];
  // buildings.push(building);
  // console.log(buildings);
  const data = {
    // buildings: [
    //   {
    //     address: addresses[0],
    //     apartments: [{ number: apartmentsNumber, entrance }],
    //   },
    // ],
    buildings,
  };
  const result = await addComplex(data);
  res.status(201).json(result);
};

export default { createComplex: ctrlWrapper(createComplex) };
