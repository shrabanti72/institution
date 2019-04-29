var express               = require("express"),
    app                   = express(),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    expressSanitizer      = require("express-sanitizer"),
    User                  = require("./models/user"),
    methodOverride        = require("method-override"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var authRoutes = require("./routets/auth");

app.use(authRoutes);

mongoose.connect("mongodb://localhost:27017/employees_app");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "Let's go undercover",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var Hod = require("../models/hod");
var Register = require("../models/register")

app.get("/principal", function(req, res){
   res.redirect("/employees"); 
});

// INDEX ROUTE
app.get("/employees", function(req, res){
       res.render("");
});

app.get("/employees/hods", function(req, res){
       Hod.find({}, function(err, hods){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {employees: hods}); 
       }
   });
});
// NEW ROUTE
app.get("/employees/new/hods", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/employees/hods", function(req, res){
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
app.get("/employees/hods/:id", function(req, res){
   Hod.findById(req.params.id, function(err, foundHod){
       if(err){
           res.redirect("/employees/hods");
       } else {
           res.render("show", {employees: foundHod});
       }
   })
});

// EDIT ROUTE
app.get("/employees/hods/:id/edit", function(req, res){
    Hod.findById(req.params.id, function(err, foundHod){
        if(err){
            res.redirect("/employees/hods");
        } else {
            res.render("edit", {hods: foundHod});
        }
    });
})


// UPDATE ROUTE
app.put("/employees/hods/:id", function(req, res){
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
app.delete("/employees/hods/:id", function(req, res){
   //destroy blog
   Hod.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/employees/hods");
       } else {
           res.redirect("/employees/hods");
       }
   })
   //redirect somewhere
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
})
