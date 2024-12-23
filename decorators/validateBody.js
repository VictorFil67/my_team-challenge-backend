import HttpError from "../helpers/HttpError.js";

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }
    req.body = value; //In order for the data to be in a form transformed as a result of validation
    console.log(value);
    next();
  };
  return func;
};

export default validateBody;
