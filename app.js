//jshint esversion:6
require("dotenv").config();//1.require it
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const exp = require("constants");
const mongoose = require("mongoose");
const { log } = require("console");
const app = express();


const encrypt = require("mongoose-encryption");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});


const userSchema =new  mongoose.Schema({

    username:String,
    password:String
});
//console.log(process.env.SECRET);

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]}); //Only encrypting password field

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
    
    const user = new User({
        username:name,
        password:pass
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
    let pass = req.body.password;


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