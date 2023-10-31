const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const theatersService = require("./theaters.service");
const reduceProperties = require("../utils/reduce-properties");

// handles GET requests for a list of theaters
async function list(req, res, next) {
  const { movieId } = req.params; // extract movieId from URL parameter

  let theaters;
  if (movieId) {
    // if movieId is truthy
    theaters = await theatersService.listByMovie(movieId); // query the theaters showing the movie with the given id
  } else {
    const response = await theatersService.list(); // otherwise, query all theaters

    theaters = reduceTheatersData(response);
  }

  res.status(200).json({ data: theaters }); // sends a JSON response with a status of OK
}

// transform and reduce the response data
function reduceTheatersData(response) {
  const configuration = {
    // configuration object is for the structure of the data for each theater
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    created_at: ["movies", null, "created_at"],
    updated_at: ["movies", null, "updated_at"],
    is_showing: ["movies", null, "is_showing"],
    theater_id: ["movies", null, "theater_id"],
  };

  return reduceProperties("theater_id", configuration)(response); // call utility function with theater_id and the config and apply it to res data
}

module.exports = {
  list: [asyncErrorBoundary(list)],
};
