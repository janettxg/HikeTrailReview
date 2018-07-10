var express = require("express");
var router  = express.Router({mergeParams: true});
var Trail = require("../models/trail");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find trail by id
    console.log(req.params.id);
    Trail.findById(req.params.id, function(err, trail){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {trail: trail});
        }
    });
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup trail using ID
   Trail.findById(req.params.id, function(err, trail){
       if(err){
           console.log(err);
           res.redirect("/trails");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               trail.comments.push(comment);
               trail.save();
               console.log(comment);
               req.flash("success", "Successfully added comment");
               res.redirect('/trails/' + trail._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {trail_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/trails/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/trails/" + req.params.id);
       }
    });
});

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                //does user own the comment?
            if(foundComment.author.id.equals(req.user._id)){
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