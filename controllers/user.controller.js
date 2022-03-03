const mongoose = require("mongoose");
const User = require("../models/user.model");
const Post = require("../models/post.model");

module.exports.getUserId = (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "Không tìm thấy!" });
    });
};

module.exports.follow = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .populate("following", "_id name email pic")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(422).json({ error: err });
        });
    }
  );
};

module.exports.unfollow = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .populate("following", "_id name email pic")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(422).json({ error: err });
        });
    }
  );
};

module.exports.updatepic = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "Không thể cập nhật ảnh" });
      }
      res.json(result);
    }
  );
};

module.exports.searchuser = (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  let nameRegex = new RegExp(req.body.query, "i");

  User.find({ $or: [{ email: { $regex: userPattern } }, { name: nameRegex }] })
    .select("_id email name pic")
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.listFollowing = (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("_id email name pic followers following")
    .populate("following", "_id name email pic")
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
};

module.exports.listFollower = async (req, res) => {
  let limit = parseInt(req.query.limit) || 5;
  User.findOne({ _id: req.params.id })
    .select("following")
    .exec((err, user) => {
      User.find({
        _id: {
          $nin: [req.params.id].concat(user.following),
        },
      })
        .limit(limit)
        .select("_id email name pic")
        .then((user) => {
          res.json(user);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    });
};
