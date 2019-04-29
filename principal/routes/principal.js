var express = require("express");
var router =express.Router();

var express               = require("express"),
    router =express.Router(),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    expressSanitizer      = require("express-sanitizer"),
    User                  = require("./models/user"),
    methodOverride        = require("method-override"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var authRoutes = require("/auth");

router.use(authRoutes);

mongoose.connect("mongodb://localhost:27017/employees_app");

router.set('view engine', 'ejs');
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.static("public"));
router.use(expressSanitizer());
router.use(methodOverride("_method"));

router.use(require("express-session")({
    secret: "Let's go undercover",
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var Hod = require("../models/hod");
var Register = require("../models/register")

router.get("/principal", function(req, res){
   res.render("principal");
});

// INDEX ROUTE
router.get("/employees", function(req, res){
       res.render("employees");
});

router.get("/employees/hods", function(req, res){
       Hod.find({}, function(err, hods){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {employees: hods}); 
       }
   });
});
// NEW ROUTE
router.get("/employees/new/hods", function(req, res){
    res.render("new");
});

// CREATE ROUTE
router.post("/employees/hods", function(req, res){
    // create blog
   req.body.user.body = req.sanitize(req.body.user.body);
    Hod.create(req.body.user, function(err, newUser){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/employees/hods");
        }
    });
});

// SHOW ROUTE
router.get("/employees/hods/:id", function(req, res){
   Hod.findById(req.params.id, function(err, foundHod){
       if(err){
           res.redirect("/employees/hods");
       } else {
           res.render("show", {employees: foundHod});
       }
   })
});

// EDIT ROUTE
router.get("/employees/hods/:id/edit", function(req, res){
    Hod.findById(req.params.id, function(err, foundHod){
        if(err){
            res.redirect("/employees/hods");
        } else {
            res.render("edit", {hods: foundHod});
        }
    });
})


// UPDATE ROUTE
router.put("/employees/hods/:id", function(req, res){
    req.body.user.body = req.sanitize(req.body.user.body);
   Hod.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedHod){
      if(err){
          res.redirect("/employees/hods");
      }  else {
          res.redirect("/employees/hods" + req.params.id);
      }
   });
});

// DELETE ROUTE
router.delete("/employees/hods/:id", function(req, res){
   //destroy blog
   Hod.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   })
   //redirect somewhere
});

module.exports = router;
