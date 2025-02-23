const ctrlWrapper = (ctrl) => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      // next(error);
      if (next) {
        next(error);
      } else {
        res
          .status(500)
          .json({ message: error.message || "Something went wrong" });
      }
    }
  };
  return func;
};
export default ctrlWrapper;
