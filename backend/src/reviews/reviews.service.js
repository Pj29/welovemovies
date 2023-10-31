const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

// get a specific review for a movie from db
function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

// update a review for a movie in the db
// updatedReview parameter object contains the final state of the review with the applied changes
// in the body of the function
function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id }) // filter condition to locate review by id
    .update(updatedReview, "*") // updates the review data in the db
    .then(() => {
      // then block starts a new query
      return knex("reviews as r") // target reviews table
        .join("critics as c", "r.critic_id", "c.critic_id") // associate the updated review with the critic who wrote it
        .select("*")
        .where({ review_id: updatedReview.review_id }) // filter condition to locate review with specific id
        .first() // retrieve first matching record
        .then(addCritic);
    });
}

// delete a movie review from the db
function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

// get a list of movie reviews
function list() {
  return knex("reviews as r")
    .join("movies as m", "r.movie_id", "m.movie_id") // connect reviews and movies tables
    .join("critics as c", "c.critic_id", "r.critic_id") // connect critics and reviews tables
    .select("r.*", "c.*"); // get all the data for reviews and the associated critics
}

module.exports = {
  list,
  read,
  update,
  delete: destroy,
};
