const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isOwner,validateListing, saveRedirectUrl} = require("../middleware.js");
const { valid } = require("joi");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listing.js");


router
.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,saveRedirectUrl,validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
);
    


//render create listing form
router.get("/new",isLoggedIn,listingController.renderNewForm);
//show particular listing
router
.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing,wrapAsync(listingController.updateListing))
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)
);

// router.get("/:id",wrapAsync(listingController.showListing));
//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
// Update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



module.exports = router;