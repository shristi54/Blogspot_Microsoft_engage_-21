const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const requirelogin = require("../middlewares/requirelogin");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const { JWT_SECRET } = require("../keys");

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) return res.json({ error: "Invalid Email/Password" });

      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) return res.json({ error: "Invalid Email/password" });

          const token = jwt.sign({ _id: user._id }, JWT_SECRET);
          const { _id, email, name } = user;
          res.json({
            token,
            user: { _id, email, name },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signup", (req, res) => {
  const { name, email, password,college,
          clgid,
          dob,
          gender } = req.body;
  if (!email || !name || !password || !clgid || !college || !gender)
    return res.status(422).json({ error: "Fill all the fields" });
  if(password.length < 6)
  return res.status(422).json({ error: "Password must be of atleast 6 characters" });
  User.findOne({ email: email })
    .then((saveduser) => {
      if (saveduser) return res.json({ error: "Account Already Exists" });
      bcrypt.hash(password, 12).then((hashedpass) => {
        const user = new User({
          name,
          email,
          password: hashedpass,
          college,
          collegeid : clgid,
          dob,
          gender
        });
        user
          .save()
          .then((user) => {
            return res.json({ message: "Registered Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password -gender -notification -dob")
    .then((user) => {
      Post.find({ postedby: req.params.id })
      .populate("postedby", "_id name")
      .select("image")
        .exec((err, posts) => {
          if (err) {
            return res.json({ error: err });
          }

          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.json({ error: "User not found" });
    });
});

router.post("/search", requirelogin, (req, res) => {
  const searchpattern = new RegExp("^" + req.body.name);
  Post.find({ title: { $regex: searchpattern, $options: "i" } })
    .populate("postedby", "_id name")
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;