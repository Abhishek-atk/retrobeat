const { usersSchema } = require("../db/schema");
const usersDB = usersSchema;
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  verifyAdmin: (req, res, next) => {
    return new Promise(async (reslove, reject) => {
      const id = req.cookies.id;
      const userExist = await usersDB.findOne({ _id: id }).lean().exec();
      const admin = userExist.isAdmin;
      if (admin) {
        next();
      } else {
        res.render("404error");
      }
    });
  },
  verifyToken: (req, res, next) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.render("404error");
      } else {
        next();
      }
    });
  },
  verifyloggedIn: (req, res, next) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  }
};
