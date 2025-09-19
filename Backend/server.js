const express = require("express");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const app = express();
const jwt = require("jsonwebtoken")
const cors = require("cors");
require("dotenv").config();
dotenv.config({ path: __dirname + "/.env" });

require("./config/db");

const authroutes = require("./routes/authroutes");
const trainerroutes = require("./routes/trainerroutes")
const batchroutes = require('./routes/batchroutes')
const courseroutes = require('./routes/courseroutes')
app.use(cors());

app.use(express.json());

app.use("/api", authroutes);
app.use("/api/trainer",trainerroutes)
app.use("/api/batch",batchroutes)
app.use("/api/course",courseroutes)

app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});
