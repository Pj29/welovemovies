const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("../movies/movies.controller");

router.route("/:movieId/theaters").get(controller.readTheaters);
router.route("/:movieId/reviews").get(controller.readReviews);

router.route("/:movieId").get(controller.read).all(methodNotAllowed);

router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
