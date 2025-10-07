const express = require("express");
const router = express.Router({ mergeParams: true }); // <- important
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, saveRedirectUrl, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// POST review
router.post("/", isLoggedIn ,saveRedirectUrl,validateReview,wrapAsync(reviewController.createReview));

// DELETE review
router.delete("/:reviewId",isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
