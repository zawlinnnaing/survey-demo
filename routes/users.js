var express = require("express");
var router = express.Router();
let models = require("../models");

/* GET users listing. */
router.get("/:userId", function(req, res, next) {
  let userId = req.params.userId;
  res.send("respond with a resource" + userId);
});

router.get("/", function(req, res, next) {
  let sessionId = req.session.id;
  if (req.session.views) {
    req.session.views++;
    req.session.hello = "hhaha";
  } else {
    req.session.views = 1;
  }
  let expireTime = req.session.cookie.maxAge / 1000;

  res.render("users/index", {
    sessionId,
    expireTime,
    viewsCount: req.session.views
  });
});

router.post("/", function(req, res, next) {
  models.Device.create({
    sessionId: req.session.id,
    createdAt: new Date(),
    updatedAt: new Date()
  })
    .then(() => {
      res.status(200).json({ msg: "entity created" });
    })
    .catch(err => {
      res.status(500).json({ error_msg: err.errors });
    });
});

router.delete("/", function(req, res, next) {
  models.Device.destroy({
    where: {
      sessionId: req.session.id
    },
    paranoid: true
  })
    .then(() => {
      res.status(200).json({ msg: "Entity deleted" });
    })
    .catch(err => {
      res.status(500).json({ error_msg: err.name });
    });
});

module.exports = router;
