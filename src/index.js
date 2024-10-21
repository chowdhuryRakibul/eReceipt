const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { isEmail } = require('validator');

mongoose.connect("mongodb://localhost:27017/beyondReceipt").then(()=>{
    console.log('mongoose connected');
}).catch((e)=>{
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
    email: { type: String, required: true },
    password: { type: String, required: true }
});

// Receipt model
const Receipt = mongoose.model('Receipt', {
    user: { type: String, required: true },
    receipts: []
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
    const userHasReceipt = await Receipt.exists({ user: req.params.id }).exec();

    if (userHasReceipt === null) {
        // insert the first receipt
        console.log("inserting the first receipt")
        const receipt = new Receipt({
            user: req.params.id,
            receipts: req.body
        })
        receipt.save();
        rsp.send(receipt);
    } else {
        console.log("previous receipt found")
        // append to the existing list
        const newReceipt = await Receipt.updateOne({user: req.params.id}, {$push: {receipts: req.body}}).exec();
        rsp.send(newReceipt);
    }
})

app.post("/:id/getReceipt", async (req, rsp) => {
    const receipts = await Receipt.find({ "user": req.params.id }).exec();
    console.log(receipts)
    rsp.send(receipts);
})

app.listen(port, ()=>{
    console.log("port connected");
}) 
