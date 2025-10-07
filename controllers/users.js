const User = require("../models/user");
const passport = require("passport");

module.exports.getSignup = (req,res)=>{
    res.render("users/signup.ejs")
};


module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
    const newUser = new User({email,username})
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to LuxuryStay!");
        res.redirect("/listings");
    })
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    }


module.exports.getLogin = (req,res)=>{
    res.render("users/login.ejs");
}


module.exports.login = async (req,res)=>{
        const {username} = req.body;
        req.flash("success",`Welcome Back  ${username}`);
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }

module.exports.logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out !");
        res.redirect("/listings");
    });
}