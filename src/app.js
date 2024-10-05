const express = require("express");

const app = express();

app.listen(7777, () => {
    console.log("Server is successfully running on port 7777");
});

//  --------------- Middlewares -----------------

app.use("/users", (req,res,next) => {
    console.log("Handling the route 1");
    // res.send("response 1!")
     next();  
  },
    (req,res,next) => {
        console.log("Handling route ")
        // res.send("response 2")
        // next();  Cannot GET /user
    }
 )

// Chain of methods--------------------

 app.use("/userss", (req,res,next) => 
{
    console.log("Handling the route 1")
    next();
 },
 [(req,res,next) =>{
    console.log("Handling the route 1")
    next();
 },
 (req,res,next) =>{
    console.log("Handling the route 1")
    res.send("Route handled 3")
    next();
  },],
 (req,res,next) =>{
    console.log("Handling the route 1")
    next();
  },
  (req,res,next) =>{
    console.log("Handling the route 1")
    // res.send("Route handled 5")
    next();
  }
 );

// --------------------------Play with code and seperate middleware types and reffering same route-------
app.get("/user", (req,res,next) => {
    console.log("First RH")
    //  res.send("Le response")
     next();
});
app.get("/user", (req,res,next) => {
    console.log("RH 2")
    //  res.send("Lelo response")
     next();
})

