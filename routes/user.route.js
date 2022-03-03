const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");
const requireLogin = require("../middlewares/requireLogin");

router.get("/user/:id", requireLogin, controller.getUserId);

router.put("/follow", requireLogin, controller.follow);

router.put("/unfollow", requireLogin, controller.unfollow);

router.put("/updatepic", requireLogin, controller.updatepic);

router.post("/search-user", requireLogin, controller.searchuser);

router.get("/list-follow-user/:id", requireLogin, controller.listFollowing);

router.get("/list-follower/:id", requireLogin, controller.listFollower);

module.exports = router;
