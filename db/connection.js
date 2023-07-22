const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DBURL)
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log(err));
