const app = require(".");
const connect = require("./database/db.js");

const PORT = 4040;
app.listen(PORT, async () => {
    await connect();
  console.log("API listening on port :", PORT);
});
