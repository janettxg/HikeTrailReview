var mongoose  = require("mongoose");
var Trail     = require("./models/trail");
var Comment   = require("./models/comment");
var User      = require("./models/user");

// create admin user
var seedAdminUser = {
    "username": "janett",
    "password": "janett"
};

var data = [
    {
        name: "Heybrook Lookout Trail", 
        image: "https://images.unsplash.com/photo-1493246116433-5a47dcaec8d5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d17c64bd3ceab5e760a267a126e8012d&auto=format&fit=crop&w=1350&q=80",
        description: "Gold Bar, WA, Heybrook Lookout is a short and moderately steep hike through a fern and moss covered forest to a fun, staircase-ridden lookout with great views of the nearby mountains. If you are introducing someone to hiking, limited on time, or trying to add on another hike or activity in the area, this is the hike for you."
    },
    {
        name: "Haiku Stairs", 
        image: "https://images.unsplash.com/photo-1465188162913-8fb5709d6d57?ixlib=rb-0.3.5&s=fcb7596fc0a5a3d279b03bbb0d7bd253&auto=format&fit=crop&w=1350&q=80",
        description: "O'ahu, HI, An historic and beautiful trail that may look moderately ok to hike but in reality it's quite difficult. The trail appears to be closed but many enthusiast hikers continue to hike there so please be aware!"
    },
    {
        name: "Max Patch Hike", 
        image: "https://images.unsplash.com/photo-1464536194743-0c49f0766ef6?ixlib=rb-0.3.5&s=b5f5cd08304d8910aafbd0e5b8f6b50d&auto=format&fit=crop&w=1350&q=80",
        description: "Madison County, NC, Hike the Appalachian Trail at Max Patch, one of North Carolina’s most popular AT hikes, on a grassy, bald mountain that’s covered in wildflowers. Catch a gorgeous sunrise, sunset or afternoon picnic on this moderate two mile loop with stunning 360-degree views and seemingly endless sunshine."
    },
    {
        name: "Lac Blanc", 
        image: "https://images.unsplash.com/photo-1469395013119-ca3b424d83e5?ixlib=rb-0.3.5&s=874f3683654b0c6d8835936cf7d91ddc&auto=format&fit=crop&w=1353&q=80",
        description: "Chamonix, France, Located in the Aiguilles Rouges nature reserve where it's considered as one of the most beautiful mountain lakes, famous for its unique panorama facing the Mont-Blanc massif. The lake is located two hours by foot from the Flegere lift."
    }, 
    {
        name: "Tongariro National Park", 
        image: "https://c1.staticflickr.com/9/8474/8353897136_253821ef5a_b.jpg",
        description: "Ruapehu District, New Zealand, The Tongariro National Park encircles the volcanoes of Tongariro, Ngauruhoe and Ruapehu and features some of New Zealand's most contrasting landscapes."
    },
    {
        name: "East End of Rundle (EEOR) Trail", 
        image: "https://images.unsplash.com/photo-1463693396721-8ca0cfa2b3b5?ixlib=rb-0.3.5&s=54c937de2c82cae5620cc9a57c30d568&auto=format&fit=crop&w=1350&q=80",
        description: "Alberta, Canada, East End Of Rundle (Eeor) is a 5.8 kilometer heavily trafficked out and back trail located near Canmore, Alberta, Canada that features beautiful wild flowers and is rated as difficult. The trail is primarily used for hiking, walking, nature trips, and birding and is best used from May until September. Dogs are also able to use this trail but must be kept on leash."
    },
    {
        name: "God's Thumb", 
        image: "https://images.unsplash.com/photo-1486341498602-542b381299f5?ixlib=rb-0.3.5&s=c1d1c2841cdba70b5507706b1d84f0c6&auto=format&fit=crop&w=1050&q=80",
        description: "Otis, Oregon, This place is called God’s Thumb, due to its shape. I’d been here months ago but it was raining and windy, so I could barely take any good shots of the place. I was also alone. I tried my luck once again yesterday and the conditions were even worse! But luckily I was not alone this time and got a few decent shots. I’ll still have to go back in the summer to catch a sunset from here"
    },
    {
        name: "Banff National Park", 
        image: "https://www.backroads.com/blog/wp-content/uploads/2018/05/Ten-Peaks.jpg",
        description: "Banff, Canada, Rocky Mountain peaks, turquoise glacial lakes, a picture-perfect mountain town and village, abundant wildlife and scenic drives come together in Banff National Park - Canada’s first national park and the flagship of the nation’s park system. Over three million visitors a year make the pilgrimage to the park for a variety of activities including hiking, biking, skiing and camping in some of the world’s most breathtaking mountain scenery."
    },
    {
        name: "Landmannalaugar", 
        image: "https://images.unsplash.com/photo-1474496517593-015d8b59450d?ixlib=rb-0.3.5&s=4ac04518632b2b87f1f1290eff25865d&auto=format&fit=crop&w=1050&q=80",
        description: "Landmannalaugar, Iceland, the People's Pools, is a vast area of stunning and unique beauty in the heart of Iceland's southern Highlands. Throughout the summer, it is one of the most popular places for hiking, either over one day or several, and natural hot spring bathing"
    },
    {
        name: "Cradle Mountain", 
        image: "https://ak-static.scoopon.com.au/scpn/deal/main/73000/fa0e670d-cd41-4716-ae02-eedc02f997e0x3Q.jpg?636410840915013377",
        description: "Tasmania, Australia, Cradle Mountain–Lake St Clair National Park, with its ancient rainforests and alpine heaths, is home to the world-famous Overland Track and iconic Cradle Mountain. Part of the Tasmanian Wilderness World Heritage Area, the park is one of the state's most special places, where ancient pines fringe glacial lakes and icy streams cascade down rugged mountains."
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
            assignedUserToData(data, admin[0]);
            callback();        
        } else {
            let newUser = new User({username: seedAdminUser.username});
            User.register(newUser, seedAdminUser.password, function(err, newUser){
                if(err){
                    console.log("error creating admin", err.message);
                }
                console.log("admin account not found, creating admin account!");
                adminUser = newUser;
                assignedUserToData(data, newUser[0]);
                callback();        
            })            
        }
    });
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
                            text: "Please leave us your reviews!",
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