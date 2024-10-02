const express = require("express");

const app = express();

app.listen(3000, () => {
    console.log("Server is successfully running on port 3000");
});

// app.use((req,res) => {
//     res.send("Hello from server at port 3000")
// });

// app.use("/", (req,res) => {
//     res.send("Hello from / path")
// })

app.use("/hello", (req,res) => {
    res.send("Hello from /hello")
})

app.use("/test", (req,res) => {
    res.send("Hello from /test")
})

app.use("/", (req,res) => {
    res.send("Hello from / path")
     })