
import express from "express";
const server = express();
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
server.set("view engine", "ejs");


// Authentication Funtion for Middleware

const isAuthentication = (req, res, next) => {

    const { token } = req.cookies;

    if (token) {
        next();
    }
    else {
        res.render("login")
    }



}

// use middleware use for form

server.use(express.urlencoded({
    extended: true
}))

// use middleware use for cookie

server.use(cookieParser());


//use for add data in database

mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName: "BackEnd",
}).then(() => {
    console.log("DataBase Connected Sucessfully")
}).catch((e) => {
    console.log(e)
});

// const Scemas = new mongoose.Schema({
//     name: String,
//     email: String,
// });
// const Data = mongoose.model("Message", Scemas)


// use for login data

const UserScemas = new mongoose.Schema({
    name: String,
    email: String,
});
const User = mongoose.model("User", UserScemas)

// server.use(express.static(path.join(path.resolve(), "public")))

// server.get("/", (req, res) => {
//     res.render("form")
// })
// server.post("/contact", async (req, res) => {



//     res.render("success")


//     await Data.create({
//         name: req.body.name,
//         email: req.body.email

//     })

//     // console.log(messageData)


// });




// server.get("/add", (req, res) => {

//     Data.create({
//         name: "hamza",
//         email: "hmzsattar99@gmail.com",
//     }).then(() => {

//         res.send("Hamza")

//     })

// });



// Login Page  OR Cookies 

server.post("/login", async (req, res) => {


    const { name, email } = req.body;


    const user = await User.create({ name, email })

    const token = jwt.sign({ _id: user._id }, "asdfghjk")
    console.log(token)

    res.cookie("token", token, {
        httpOnly: true, expires: new Date(Date.now() + 60 * 1000)
    });
    
    res.redirect("/")





    // console.log(messageData)


});

// server.get("/", (req, res) => {

//     const { token } = req.cookies;

//     if (token) {
//         res.render("logout")
//     }
//     else {
//         res.render("login")
//     }

// })

server.get("/", isAuthentication, (req, res) => {
    res.render("logout")
})

server.get("/logout", (req, res) => {

    res.cookie("token", null, {
        httpOnly: true, expires: new Date(Date.now())
    });
    res.redirect("/")




});



// server.get("/users", (req, res) => {
//     res.json(
//         {
//             users,
//         }
//     )
// })

// server.get("/", (req, res) => {
//     res.render("index", { name: "hamza" })

//     res.sendFile("index.html")
// })



server.get("/", (req, res) => {
    res.sendStatus(404);
})


server.listen(5000, () => {
    console.log("server is working")

})