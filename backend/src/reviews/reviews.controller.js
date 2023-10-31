const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reviewsService = require("./reviews.service");

// middleware to check if a review exists
async function reviewExists(req, res, next) {
  const { reviewId } = req.params; // extract the reviewId from incoming request
  const review = await reviewsService.read(reviewId); // async op to retrieve the review with the id
  if (review) {
    // checks if a review with the matching id is in the db
    res.locals.review = review; // store review in res.locals
    return next();
  }
  next({
    status: 404,
    message: `Review cannot be found`,
  });
}

// handle updating reviews
async function update(req, res) {
  const updatedReview = {
    // spread properties of req.body.data into a new object
    ...req.body.data,
    review_id: res.locals.review.review_id, // set the review id to the one stored in res.locals
  };
  const data = await reviewsService.update(updatedReview); // async call to update
  res.json({ data }); // json response to send to client containing updated review stored in data
}

// delete a review from the db
async function destroy(req, res) {
  const { review } = res.locals; // extract review object from res.locals
  await reviewsService.delete(review.review_id); // async call to delete the review with id
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
