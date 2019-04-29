var express = require("express");
var router =express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/register", function(req, res) {
   res.render("register");
});
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/principal");
        });
    });
});


router.get("/principal",isLoggedIn, function(req, res){
   res.render("principal"); 
});

router.get("/login",function(req, res){
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/principal",
    failureRedirect: "/login"
}) ,function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;