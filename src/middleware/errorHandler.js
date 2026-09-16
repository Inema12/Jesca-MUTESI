// A single place to catch unexpected errors so every route doesn't
// need its own try/catch formatting logic. Controllers call next(err)
// when something unexpected happens, and it ends up here.

function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server";

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
