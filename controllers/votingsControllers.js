const createVoting = async (req, res) => {
  const { is_admin, buildings } = req.user;
  const { residential_complex_id } = req.params;
  //   const { text, type, building_id } = req.body;

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
};
