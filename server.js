require("dotenv").config();
require("./config/db_connection");
const express = require("express");
const path = require("path");
const morgan= require("morgan");
const authRouter = require("./routes/user-routes")

const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/auth", authRouter);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

