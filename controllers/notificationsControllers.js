const createNotification = async (req, res) => {
  const user = req.user;
  const { complex_id, building_id } = req.params;

  let complex;
  const { residential_complex: complexAdmin } = req.query;
  const { residential_complex: complexModerator } = user;
  const { text, type, section } = req.body;
  if (complexAdmin) {
    complex = complexAdmin;
  } else {
    complex = complexModerator;
  }
  res.status(201);
};
