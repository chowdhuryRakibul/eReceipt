const mongoose=require("mongoose");
const { isLowercase } = require("validator");
const { default: isEmail } = require("validator/lib/isEmail");

const usersSchema=new mongoose.Schema({
    email: {
        type:String,
        required:[true, "Please enter a username"],
        unique: true,
        isLowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type:String,
        required:[true, "Please enter the password"],
        minlength: [6, "minimum password length is 6"]
    }
})

usersSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const LogInCollection = mongoose.model('LogInCollection', usersSchema);

module.exports = LogInCollection;