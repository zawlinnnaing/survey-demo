let express = require("express");
let models = require("../models");
let router = express.Router();
router.post("/", (req, res, next) => {
  models.Form.bulkCreate(
    [
      {
        title: "Testing"
      },
      {
        title: "Testing 2"
      }
    ],
    {
      returning: true
    }
  )
    .then(results => {
      res.status(200).json({ results: results });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
