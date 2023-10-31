const knex = require("../db/connection");

// get a list of theaters from the db
function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id") // associate each theater with the movies it shows
    .join("movies as m", "m.movie_id", "mt.movie_id") // associate each movie with the theaters its currently being shown in
    .select("t.*", "m.*"); // select all columns from theaters table and movies table
}

module.exports = {
  list,
};
