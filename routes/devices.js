let router = require("express").Router();
let models = require("../models");

router.post("/", (req, res, next) => {
  models.Device.create({
    sessionId: req.session.id
  }).then(result => {
    res.status(200).json(result);
  });
});

module.exports = router;
