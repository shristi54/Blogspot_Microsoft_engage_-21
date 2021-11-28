const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const Notification = mongoose.model("Notification")

const requirelogin = require("../middlewares/requirelogin");

router.get("/allposts", requirelogin, (req, res) => {
  Post.find()
    .populate("postedby", "_id name")
    .sort("-createdAt")
    .populate("comments.commentby", "_id name")
    .then((posts) => {
      //console.log(posts, req.user);
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requirelogin, (req, res) => {
  const { title, description, postedby, image } = req.body;
  if (!title) return res.json({ error: "Title field is empty" });

  req.user.password = undefined;
  req.user.email = undefined;
  const post = new Post({
    title,
    description,
    image,
    postedby: req.user,
  });

  post
    .save()
    .then((posted) => {
      //console.log(posted)
      res.json({ message: "Posted Successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myposts", requirelogin, (req, res) => {
  Post.find({ postedby: req.user._id })
    .populate("postedby", "_id name")
    .sort("-createdAt")
    .then((mypost) => {
      User.findOne({ _id: req.user._id }).then((userdata) => {
        res.json({ mypost, userdata });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requirelogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postid,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.json({ error: err });
    } else {
      res.json({ result });
    }
  });
});

router.put("/dislike", requirelogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postid,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.json({ error: err });
    } else {
      res.json({ result });
    }
  });
});

router.put("/comment", requirelogin, (req, res) => {
  const comment = {
    text: req.body.text,
    commentby: req.user._id,
  };
  //console.log(req.body.postid);
  Post.findByIdAndUpdate(
    req.body.postid,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.commentby", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      } else {
        res.json({ result });
      }
    });
});

router.delete("/deletepost/:postid", requirelogin, (req, res) => {
  Post.findOne({ _id: req.params.postid })
    .populate("postedby", "_id")
    .exec((err, result) => {
      if (err || !result) return res.json({ error: err });

      if (result.postedby._id.toString() == req.user._id.toString()) {
        result
          .remove()
          .then((post) => {
            res.json({ message: "Deleted Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

router.delete("/deletecomment/:postid/:commentid", requirelogin, (req, res) => {
  Post.updateOne(
    { _id: req.params.postid },
    {
      $pull: { comments: { _id: req.params.commentid } },
    }
  ).then((result) => {
    res.json({ result });
  });
});

router.post("/profilepic", requirelogin, (req, res) => {
  const { mypic } = req.body;
  req.user.password = undefined;
  req.user.email = undefined;

  User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      mypic: mypic,
    },
    {
      new: true,
    }
  )
    .then((result) => {
      res.json({ message: "Profile Pic Updated" });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/askme/:postid/:user_id",requirelogin,(req,res)=>{
  Post.findByIdAndUpdate(
    {_id : req.params.postid},
    {
      $push: { askme: req.params.user_id },
    },{
      new : true,
    }).exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      } else {
        res.json({ result,message : "You will be notified" });
      }
    })

})


router.delete("/deleteaskme/:postid/:user_id",requirelogin,(req,res)=>{
  const {postid,user_id} = req.body;
  Post.updateOne(
    {_id : req.params.postid},
    {
      $pull: { askme: req.params.user_id },
    },{
      new : true
    }).exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      } else {
        res.json({ result,message : "You will not be reminded" });
      }
    })
})

router.get("/getuser/:postid",requirelogin,(req,res)=>{
  Post.findOne({_id : req.params.postid})
  .select("askme")
  .populate("askme","_id")
  .then(result=>{
    res.json({result:result.askme})
  }).catch(err=>{
    console.log(err)
  })
})


router.post("/sendreq",requirelogin,(req,res)=>{
  const {title,message,postid,userid,response} = req.body;
  // const senderid = req.user._id;

  if (!title) return res.json({ error: "Title field is empty" });

  const notification = new Notification({
    title,
    message,
    postid,
    sender : req.user._id,
    reciever : userid,
    response
  })

  notification.save()
  .then((posted) => {
    res.json({ posted });
  })
  .catch((err) => {
    console.log(err);
  });
  
})

router.get("/getrequest/:notid",requirelogin,(req,res)=>{
  Notification.findById({_id : req.params.notid})
  .select("title message postid sender response")
  .then(result=>{
      Post.findById({_id : result.postid})
      .select("title description image")
      .then(data=>{
          res.json({result,data})
      }).catch(err=>{
          console.log(err)
      })
  }).catch(err=>{
      console.log(err)
  })
})

router.put("/notify/:noteid/:user_id",requirelogin,(req,res)=>{
  User.findByIdAndUpdate(
    {_id : req.params.user_id},
    {
      $push: { notification: req.params.noteid },
    },{
      new : true,
    })
    .select("college")
    .exec((err, result) => {
      if (err) {
        return res.json({ error: err});
      }
      // console.log(result)
    })

})


router.get("/getnotifications",requirelogin,(req,res)=>{
  Notification.find({ reciever: req.user._id })
  .sort("-createdAt")
  .then(data=>{
    res.json({data})
  }).catch(err=>{
    console.log(err)
  })
})

module.exports = router;