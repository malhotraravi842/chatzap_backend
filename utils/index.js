exports.throwErr = (err, next, status, message) => {
  const error = new Error();
  error.data = err;
  error.message = message ? message : "Something went wrong";
  error.status = status ? status : 500;
  return next(error);
};
