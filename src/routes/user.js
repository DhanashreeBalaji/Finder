const express = require("express")
const userRouter = express.Router();

const {userAuth} = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// ------------------------  For the current loggedInUser, you are going to get all their pending connections -----------------------

userRouter.get("/user/requests/received", userAuth, async (req,res) => {
try{
    const loggedInUser = req.user;
    //  Get all the connection requests from database as per he condition and store in pendingrequests
    
       const pendingRequests = await connectionRequest.find({
         toUserId : loggedInUser._id,
         status: "interested",
       }) .populate("fromUserId", USER_SAFE_DATA);
        // }).populate("fromUserId", ["firstName", "lastName"]);

       res.json({
            message:"Data fetched successfully",
            data: pendingRequests,
        }
       )
    } catch(err) {
        res.statusCode(400).send("ERROR: " + err.message);
    }
});

//  ----------------------- Get your matches ------------------------i
 
userRouter.get("/user/connections", userAuth, async (req,res)=> {
    try{
 const loggedInUser = req.user;

 const matches = await connectionRequest.find({
    $or: [
        {toUserId: loggedInUser._id, status: "accepted"},
        {fromUserId: loggedInUser._id, status: "accepted"},
    ],
 })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

    // console.log(matches);

    //  From each row (of connectionrequestModel ka each document) you are returning the from userid details or to userId details, nothing else like status of the request.
       const data = matches.map((row) => {
     if(row.fromUserId._id.toString() === loggedInUser._id){
        return row.toUserId;
     }
        return row.fromUserId;
   });

  res.json({ data})

    } catch(err){
       res.status(400).send({ message: err.message });
    }
})

// -------------- FEED API ---------------------

userRouter.get("/feed", userAuth, async (req,res) => {

    try{

           const loggedInUser = req.user;
            //  Adding Pagination
           const page = parseint(req.query.page) || 1;
           let limit = parseInt(req.query.limit) || 10;
           limit = limit>50 ? 50 : limit;
           const skip = (page-1) * 10;

        //    From connectionRequest model, find the requests/people that had a relation with the logged in person in past/present by checking from and to userIds. 

        const relatedRequests = await connectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ],
        }) .select("fromUserId   toUserId"); 
    
// Find the people who are involved in the requests and put them in a set

        const hideUsersFromFeed = new Set();
        relatedRequests.forEach((req) => {
          hideUsersFromFeed.add(req.fromUserId.toString());
          hideUsersFromFeed.add(req.toUserId.toString());
        });
    
        //  Leaving these people suggestions of other Tinder users should be selected
//  Now the user list is fetched from DB but based on some conditions. 
//  skip will function everytime depending on page number and it will skip many users from starting and fetch the remaining based on the limit given. 
//  Also only those details of the user is given to frontend, through select methood we are limiting the data send to frontend.

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
          .select(USER_SAFE_DATA) 
          .skip(skip)
          .limit(limit);

          res.json({data: users}) ; 
    
    }
   catch(err){
    res.status(400).json({ message: err.message });
   }
});


module.exports = userRouter;