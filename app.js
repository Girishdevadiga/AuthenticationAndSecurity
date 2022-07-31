//jshint esversion:6
require("dotenv").config();//1.require it
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { log } = require("console");
const app = express();

//1.Require MD5
const md5 = require("md5");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});


const userSchema =new  mongoose.Schema({
    username:String,
    password:String
});

const User = new mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");

});

app.post("/register",(req,res)=>{

    let name = req.body.username;
    let pass = md5(req.body.password); //2.Hash the password using md5
    
    const user = new User({
        username:name,
        password:pass    //3.Store it in db
    });
    user.save((err)=>{
        if(err){
            console.log(err);
        }
        else
        {
            res.render("secrets");
        }
    });
});

app.post("/login",(req,res)=>{
    let name = req.body.username;
    let pass = md5(req.body.password); //4.Hash the password to match it with hashed-passowrd in db.


    User.findOne({username:name},(err,foundUser)=>{

        if(err){
           console.log(err); 
          
        }
        else{
            if(foundUser){
                if(foundUser.password==pass){
                    console.log("Login Successfull");
                    res.render("secrets");
                }
                else
                {
                    res.redirect("/")  
                }
            }
           
        }
    });

});

app.listen(3000,()=>{
    console.log("Server Started !");
});