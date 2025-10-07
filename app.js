const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Listing = require("./models/listing.js");
const data = require("./init/data.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema ,reviewSchema} = require("./schemaJoi.js");
const Review = require("./models/review.js");

const MongoStore = require("connect-mongo");

const ListingRouter = require("./routes/listingsPart.js");
const ReviewRouter = require("./routes/reviewPart.js");
const UserRouter = require("./routes/user.js");

const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");//for sign and login 
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");//user details

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;


if(process.env.NODE_ENV != "production"){
require('dotenv').config();
console.log(process.env);
}




app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));



app.use(cookieParser("secretcode"));//middleware

const store = MongoStore.create({
   mongoUrl:dbUrl,
   crypto:{
      secret:process.env.SECRET,
   },
   touchAfter:24*3600,
});

const sessionOptions = {
   store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },

};

store.on("error",()=>{
   console.log("Error in Mongo Session Store",err);
});


app.use(session(sessionOptions));
app.use(flash());

//for every request passport will be initialized 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//login or signup
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
app.use("/",UserRouter);
app.use("/listings",ListingRouter);//for rendering listing server side code
app.use("/listings/:id/reviews", ReviewRouter);//for rendering review server side code


app.get("/contact",(req,res)=>{
   res.render("contact.ejs");
})


//sending cookies
app.get("/getcookies",(req,res)=>{
   res.cookie("greet","hello" ,{signed:true});
   res.cookie("madeIn","India",{signed:true});
   res.send("Sent you some Cookies! ");
})


const initDB = async()=>{
   await Listing.deleteMany({});
   // console.log(data);
   await Listing.insertMany(data);
};


// initDB();



main()
   .then(()=>{
       console.log("Connect to DB");
   })
   .catch((err)=>{
       console.log(err);
   });
  


async function main() {
   await mongoose.connect(dbUrl);
}


// app.get("/",(req,res)=>{
//    console.dir(req.signedCookies);
//    res.send("Hi i am root");
// });




app.all(/.*/,(req,res,next)=>{
   next(new ExpressError(404,"Page Not Found Bhai !"));
});



//at the last
app.use((err,req,res,next)=>{
   let{statusCode = 500,message ="Something went wrong dear "}=err;
   res.render("error.ejs",{statusCode,message});
});


app.listen(8080, ()=>{
   console.log("Server is listening to port 8080");
});



