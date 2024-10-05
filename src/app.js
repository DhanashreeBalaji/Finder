const express = require("express");

const app = express();

app.listen(7777, () => {
    console.log("Server is successfully running on port 7777");
});

// app.use((req,res) => {
//     res.send("Hello from server at port 3000")
// });

// -----------------Play with routes and route extensions ex: /hello, /hello2, /, /xyz-------------

// app.use("/", (req,res) => {
//     res.send("Hello from / path")
// })

// app.use("/hello/2", (req,res) => {
//     res.send("Hello from /hello")
// })

// app.use("/test", (req,res) => {
//     res.send("Hello from /test")
// })

// app.use("/", (req,res) => {
//     res.send("Hello from / path")
// })

// -------------Order of routes matter a lot----------------------------------

// This will work for get/post/put/delete if path is /user. Order matters

// app.use("/user", (req,res) => {
//     res.send("HAHAHAHAHAHAHA")
// })

//------Write logic to handle GET,POST,PUT,DELETE API Calls and test them on postman---------- 
// The method and path both together form a API.

// app.get("/user", (req,res) => {
//     res.send({firstName: "Dhanashree", lastName: "Hari"})
// })

// app.post("/user", (req,res) => {
//     console.log("Save data to DB")
//     res.send("Data saved successfully to DB");
// })

// app.delete("/user", (req,res) => {
//     res.send("Data Deleted");
// })

// ---------Exploring routing and use of ?,*,(),+ in the routes-------------------------

// app.get("/ab?c", (req,res) => {
//     res.send("regex testing");
// })


// app.get("/ab+c", (req,res) => {
//     res.send("regex testing");
// })


// app.get("/ab*c", (req,res) => {
//     res.send("regex testing");
// })

// app.get("/a(bc)?d", (req,res) => {
//     res.send("regex testing");
// })

// app.get("/a(bc)+d", (req,res) => {
//     res.send("regex testing");
// })

// app.get("/a(bc)*d", (req,res) => {
//     res.send("regex testing");
// })

// app.get(/a/ ,(req,res) => {
//     res.send("regex testing")
// })

// app.get(/.*fly$/, (req,res) => {
//     res.send("regex testing");
// })

// --------------- Getting query parameters in route handlers -------[req.query]

//  app.get("/user", (req,res) => {
//     console.log(req.query);
//     res.send(req.query)
// http://localhost:7777/user?userId=101&password=testing
//  });

//   -------------- Dynamic Routes ---------------[req.params]

// app.get("/user/:userId/:name/:password", (req,res) => {
    // console.log(req.params);
    // res.send(req.params)
    // http://localhost:7777/user/707/Hari/testing
//  });
