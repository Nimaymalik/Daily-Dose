const express = require("express");
const app = express();

const authRouter = require("./Routers/authRouter.js");
const medicineRouter = require("./Routers/medicineRouter.js");
const bodyparser = require("body-parser");

app.use(bodyparser.json());

app.use("/", authRouter);

app.use("/api/medication", medicineRouter);

module.exports = app;
