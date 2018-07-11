var mongoose  = require("mongoose");
var Trail     = require("./models/trail");
var Comment   = require("./models/comment");
var User      = require("./models/user");

// create admin user
var seedAdminUser = {
    "username": "admin",
    "password": "admin"
};

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Test", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }    
]

function seedDB(){
    refreshAdminUser(refreshTrails);
}

function refreshAdminUser(callback) {
    User.find({username: seedAdminUser.username}, function(err, admin){
        var adminUser = null;
        if(admin.length > 0) {
            console.log("found admin account!");
            adminUser = admin;
        } else {
            let newUser = new User({username: seedAdminUser.username});
            User.register(newUser, seedAdminUser.password, function(err, newUser){
                if(err){
                    console.log("error creating admin", err.message);
                }
                console.log("admin account not found, creating admin account!");
                adminUser = newUser;
            })            
        }
        assignedUserToData(data, adminUser[0]);
        callback();        
    })
}

function refreshTrails(){
    Trail.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed trails!");
         //add a few trails

         console.log(data);

        data
        .forEach(function(seed){
            Trail.create(seed, function(err, trail){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a trail");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: trail.author,
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                trail.comments.push(comment);
                                trail.save();
                                console.log(trail);

                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
}

function assignedUserToData(data, user){
    data.forEach(function(trail){
        let adminAuthor = {
            id: user._id,
            username: user.username
        };
        trail.author = adminAuthor;
    })
}
module.exports = seedDB;