const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.js");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");


router.get("/signup", userController.getSignup);

router.post("/signup",wrapAsync(userController.signup));


router.get("/login",userController.getLogin);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),userController.login);

router.get("/logout",userController.logout);

module.exports= router;
