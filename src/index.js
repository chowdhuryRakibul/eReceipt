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

// Receipt model
const Receipt = mongoose.model('Receipt', {
    user: { type: String },
    vendor: { type: String },
    address: { type: String },
    phone: { type: String },
    date: { type: String },
    items: []
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

app.post("/login", async (req, rsp) => {
    const {email, password} = req.body;
    const dbRsp = User.findOne({ "email": email });
    const user = await dbRsp.exec();
    console.log(req.body);
    console.log(user)
    if (user.password === password) {
        console.log(user._id)
        rsp.send(user._id);
    } else {
        rsp.send("user not found")
    }
})

app.post("/:id/postReceipt", async (req, rsp) => {
    const {vendor, address, phone, date, items} = req.body;
    const receipt = new Receipt({
        user: req.params.id,
        vendor: vendor,
        address: address,
        phone: phone,
        date: date,
        items: items
    })
    receipt.save();
    rsp.send(receipt);
})

app.listen(port, ()=>{
    console.log("port connected");
}) 
