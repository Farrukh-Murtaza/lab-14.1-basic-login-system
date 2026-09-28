require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;


mongoose.connect(MONGO_URI);


mongoose.connection.once("open" , () => {
    console.log(`Connecting to MongoDB : ${mongoose.connection.name}`);
});


mongoose.connection.on("error" , (error) => {
    console.log("MongoDB coneecting error", error);
});


mongoose.connection.once("close", () => {
     console.log("Connecting to MongoDB has closed:");
})