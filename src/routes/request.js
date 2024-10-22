const express = require("express")
const requestRouter = express.Router();
const User = require("../models/User");
const ConnectionRequest = require("../models/connectionRequest")

const {userAuth} = require ("../middleware/auth") ;

  requestRouter.post("/request/send/:status/:toUserId" , userAuth, async(req,res) => {
      try{
        // from user id is logged in user
       const fromUserId = req.user._id;
       const toUserId = req.params.toUserId;
       const status = req.params.status;

      //  Applying all API VALIDATIONS

   const allowedStatus = ["ignored", "interested"];
   if(!allowedStatus.includes(status)) {
    return res 
    .status(400)
    .json({message: "Invalid status type: " + status});
   }

   const toUser = await User.findById(toUserId);
   if(!toUser){
    return res.status(404).json({message: "User not Found"});
   }

   const existingConnectionRequest = await ConnectionRequest.findOne({
     $or: [
      {fromUserId, toUserId},
      {fromUserId: toUserId, toUserId: fromUserId},
     ],
   });
    if(existingConnectionRequest) {
      return res
      .status(400)
      .send({ message: "Connection Request Already Exists!!" });
    }

    // After the checks create the connection request if such a request not exists before
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

     const data = await connectionRequest.save();

     res.json({
      message:
      req.user.firstName + " is " + status + " in " + toUser.firstName,
      data,
     })

      } catch(err){
        res.status(400).send("ERROR: " + err.message);
        console.log(err)
      }
     }
  );

  // ---------------------- Review if the request is accepted or rejected for a incoming request ----------------------

  requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
          try{
             const loggedInUser = req.user;
             const {status, requestId} = req.params;

             const allowedStatus = ["accepted", "rejected"];
             if(!allowedStatus.includes(status)) {
                return res.status(400).json({message: "Status not allowed"});
             }

            //  If you write find function here instaed of findOne error comes as "TypeError: incomingRequest.save is not a function" as findOne returns an object. The object is saved in dATABASE
               const incomingRequest = await ConnectionRequest.findOne({
                _id : requestId,
                toUserId : loggedInUser._id,
                status: "interested",

               });
               if(!incomingRequest) {
                return res
                 .status(404)
                 .json({ message: "Connection request not found" });
               }

              //   If such a request exists, do the changes in the mongodb document and save it
              incomingRequest.status = status;
              const data = await incomingRequest.save();
              res.json({message: " Connection request " + status, data});

          } catch(err){
            res.status(400).send("ERROR: " + err.message);
            console.log(err)
          }
  });
  

  module.exports = requestRouter;