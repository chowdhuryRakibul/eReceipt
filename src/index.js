const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { isEmail } = require('validator');
// const User = require("mongodb")

mongoose.connect("mongodb://localhost:27017/beyondReceipt")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000;

app.post("/",(req, rsp) => {
    rsp.send("login");
});


// User model
const User = mongoose.model('User', {
    email: { type: String },
    password: { type: String }
});

app.post("/signup", async (req, rsp) => {
    const {email, password} = req.body;
    const user = new User({
        email: email,
        password: password
    })
    user.save();
    rsp.send(user);
})

app.post("/login", (req, rsp) => {
    rsp.send("login");
    const {email, password} = req.body;
    const dbRsp = User.findOne({ email: email }, "password");
    console.log(req.body);
    console.log(dbRsp);
})

app.listen(port, ()=>{
    console.log("port connected");
}) 