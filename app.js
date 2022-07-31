//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const exp = require("constants");
const mongoose = require("mongoose");
const { log } = require("console");
const app = express();

//1.Require the package
const encrypt = require("mongoose-encryption");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

//2.add new keyword to schema
const userSchema =new  mongoose.Schema({

    username:String,
    password:String
});
//3.plugin encryption before creating the model
const secret = "Thisisoursecret";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]}); //Only encrypting password field

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

    //it will automatically decrypt the password when find is called.no need to write extra code
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