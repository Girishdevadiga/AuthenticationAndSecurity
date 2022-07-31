//jshint esversion:6
require("dotenv").config();//1.require it
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { log } = require("console");
const app = express();

//1.Require bcrypt
const bcrypt = require("bcrypt");

//2.Salt round
const SaltRound = 10;


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
    let pass = req.body.password; 

    //3.hash the password using bcrypt.hash()
    bcrypt.hash(pass,SaltRound,function(err,hash){  //here hash is the hashed password store it in db

        const user = new User({
            username:name,
            password:hash //3.1 stored in db
        });
        user.save((err)=>{
            if(err){r
                console.log(err);
            }
            else
            {
                res.render("secrets");
            }
        });
    });

});

app.post("/login",(req,res)=>{
    let name = req.body.username;
    let pass = req.body.password; 


    User.findOne({username:name},(err,foundUser)=>{

        if(err){
           console.log(err); 
          
        }
        else{
            if(foundUser){

                //4.compare the password using bcrypt.compare()

                bcrypt.compare(pass,foundUser.password,function(err,result){

                    if(result==true){
                        console.log("Login Successfull");
                        res.render("secrets");
                    }
                    else
                    {
                        res.redirect("/")  
                    }
                });
              
            }
           
        }
    });

});

app.listen(3000,()=>{
    console.log("Server Started !");
});