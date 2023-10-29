const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function ifExists(req, res, next) {
  const { movieId } = req.params;
  const foundMovie = await moviesService.read(movieId);
  if (foundMovie) {
    res.locals.movie = foundMovie;
    return next();
  } else {
    next({
      status: 404,
      message: `Movie cannot be found.`,
    });
  }
}

function read(req, res) {
  res.status(200).json({ data: res.locals.movie });
}

async function readTheaters(req, res, next) {
  const { movieId } = req.params;
  const data = await moviesService.readTheaters(movieId);
  res.json({ data });
}

async function readReviews(req, res) {
  const { movieId } = req.params;
  const data = await moviesService.readReviews(movieId);
  res.json({ data });
}

async function list(req, res, next) {
  const { is_showing } = req.query;
  if (is_showing) {
    const data = await moviesService.listShowing();
    return res.json({ data });
  }
  const data = await moviesService.list();
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(ifExists), read],
  readTheaters: [
    asyncErrorBoundary(ifExists),
    asyncErrorBoundary(readTheaters),
  ],
  readReviews: [asyncErrorBoundary(ifExists), asyncErrorBoundary(readReviews)],
};
