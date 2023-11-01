const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

// knex queries, select all columns from movies table, filter the movie_id column with inputted
// movieId and get the first matching record in the db
function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

// get a list of theaters associated with the movie ID in the db
function readTheaters(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id") // join movies table with movies_theaters table
    .join("theaters as t", "t.theater_id", "mt.theater_id") // join theaters table with the movies_theaters table based on theater_id
    .select("t.*")
    .where({ "m.movie_id": movieId }); // filter results to theaters only with associated movieId
}

// get the reviews for a movie with a corresponding movieId
function readReviews(movieId) {
  return knex("movies as m")
    .join("reviews as r", "r.movie_id", "m.movie_id") // join movies table to reviews table based on movie_id
    .join("critics as c", "c.critic_id", "r.critic_id") // join critics table to reviews table based on critic_id
    .where({ "m.movie_id": movieId }) // filter results to reviews only with the inputted movieId
    .select("*") // select all columns from the result
    .then((reviews) => reviews.map(addCritic)); // then get an array of reviews and transform it with map(addCritic) to add critic info
}

// retrieve the list of movies that are currently being shown in theaters
function listShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id") // join movies_theaters table with movies table based on movie_id
    .select("m.*")
    .where({ "mt.is_showing": true }) // filter results to movies where is_showing column in movies_theaters is set to true
    .groupBy("m.movie_id"); // group each row by movie_id column
}

// get list of all movies in the table
function list() {
  return knex("movies").select("*");
}

module.exports = {
  list,
  listShowing,
  read,
  readTheaters,
  readReviews,
};
