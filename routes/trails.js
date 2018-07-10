var express = require("express");
var router  = express.Router();
var Trail = require("../models/trail");
var middleware = require("../middleware");


//INDEX - show all trails
router.get("/", function(req, res){
    // Get all trails from DB
    Trail.find({}, function(err, allTrails){
       if(err){
           console.log(err);
       } else {
          res.render("trails/index",{trails:allTrails});
       }
    });
});

//CREATE - add new trail to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to trails array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newTrail = {name: name, image: image, description: desc, author:author};
    // Create a new trail and save to DB
    Trail.create(newTrail, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to trails page
            console.log(newlyCreated);
            res.redirect("/trails");
        }
    });
});

//NEW - show form to create new trail
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("trails/new"); 
});

// SHOW - shows more info about one trail
router.get("/:id", function(req, res){
    //find the trail with provided ID
    Trail.findById(req.params.id).populate("comments").exec(function(err, foundTrail){
        if(err){
            console.log(err);
        } else {
            console.log(foundTrail);
            //render show template with that trail
            res.render("trails/show", {trail: foundTrail});
        }
    });
});

// EDIT TRAIL ROUTE
router.get("/:id/edit", middleware.checkTrailOwnership, function(req, res){
    Trail.findById(req.params.id, function(err, foundTrail){
        res.render("trails/edit", {trail: foundTrail});
    });
});

// UPDATE TRAIL ROUTE
router.put("/:id",middleware.checkTrailOwnership, function(req, res){
    // find and update the correct trail
    Trail.findByIdAndUpdate(req.params.id, req.body.trail, function(err, updatedTrail){
       if(err){
           res.redirect("/trails");
       } else {
           //redirect somewhere(show page)
           res.redirect("/trails/" + req.params.id);
       }
    });
});

// DESTROY TRAIL ROUTE
router.delete("/:id",middleware.checkTrailOwnership, function(req, res){
   Trail.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/trails");
      } else {
          res.redirect("/trails");
      }
   });
});

function checkTrailOwnership(req, res, next){
      if(req.isAuthenticated()){
            Trail.findById(req.params.id, function(err, foundTrail){
                if(err){
                    res.redirect("back");
                } else {
                    //does user own the trail?
                if(foundTrail.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
                }
            });
        } else {
            res.redirect("back");
        }
}

module.exports = router;
