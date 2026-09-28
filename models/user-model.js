const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = mongoose.Schema({
    
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/.+@.+\..+/, "Must match an email address!"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8 , "Password must be al least 8 characters long."],
        trim: true,
        select: false
    }
}, {
    timestamps: true
});


userSchema.pre("save", async function() {   
    if (this.isNew || this.isModified("password")) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
});

userSchema.methods.isCorrectPassword = async function(password){
    return  await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;