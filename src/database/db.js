const mongoose = require("mongoose");

const mongoURL =
  "mongodb+srv://nimaymalik12:nimaymalik@cluster0.igosw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connect() {
  return mongoose.connect(mongoURL);

}

module.exports = connect;
