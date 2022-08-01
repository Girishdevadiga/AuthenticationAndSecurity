//jshint esversion:6
require("dotenv").config();//1.require it
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { log } = require("console");
const app = express();

//1.Require package
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//2.Setup the session; you can getit from document
app.use(session({
    secret: "this is my secret.",
    resave: false,
    saveUninitialized: false
}));

//3.Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });
// If deprication WARN !=> mongoose.set("useCreateIndex",true);

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
//4.Plugin passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

//5.Serialize and Deserialize 
passport.use(User.createStrategy());

//serialize=>creates cookie    deserialize=>discoveres who is the user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");

});
app.get("/secret", (req, res) => {

    if (req.isAuthenticated()) {
        res.render("secrets");
    }
    else {
        res.redirect("/login");
    }

});

app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        }
        else{

            res.redirect("/");
        }
        
    });
});

app.post("/register", (req, res) => {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        }
        else {
            passport.authenticate("local")(req, res, function () {

                res.redirect("/secrets");
            });
        }
    });

});

app.post("/login", (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.logIn(user, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secret");
            });
        }
    })

});

app.listen(3000, () => {
    console.log("Server Started !");
});