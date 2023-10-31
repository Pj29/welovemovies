const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// middleware to check if a movie resource exists
async function ifExists(req, res, next) {
  const { movieId } = req.params; // extract movieId from URL parameter
  const foundMovie = await moviesService.read(movieId); // fetch movie with specific id from database
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

// route handler for GET requests for movies, 200 response for successful requests
function read(req, res) {
  res.status(200).json({ data: res.locals.movie });
}

// route handler for retrieving a list of theaters with a certain movieId
async function readTheaters(req, res, next) {
  const { movieId } = req.params; // extract movieId
  const data = await moviesService.readTheaters(movieId); // fetch theaters from database
  res.json({ data });
}

// route handler to fetch a list of reviews
async function readReviews(req, res) {
  const { movieId } = req.params; // extract movieId
  const data = await moviesService.readReviews(movieId); // fetch reviews from database
  res.json({ data });
}

// route handler to fetch a list of movies
async function list(req, res, next) {
  const { is_showing } = req.query; // check is_showing query param
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
