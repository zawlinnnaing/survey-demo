let express = require("express");
let models = require("../models");
let router = express.Router();

router.get("/", (req, res, next) => {
  res.render("forms/index", { title: "Create a form" });
});
router.post("/", (req, res, next) => {
  let data = req.body;
  let questions = req.body.questions;

  questions.reduce()

  models.Form.create({
    title: data.title,
    description: data.description
  })
    .then(form => {
      models.Device.findOne({
        where: {
          sessionId: req.session.id
        }
      }).then(device => {
        form.addDevice(device, {
          through: {
            status: "active"
          }
        });
      });
      res.status(200).json({
        data: form
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:formId", (req, res, next) => {
  let id = req.params.formId;
  models.Form.destroy({
    where: {
      id: id
    }
  })
    .then(() => {
      res.status(200).json({ msg: "Deletion successful" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        msg: "Deletion failed"
      });
    });
});

router.post("/:formId/text-questions", (req, res, next) => {
  models.Form.findOne({
    where: {
      id: req.params.formId
    }
  })
    .then(form => {
      form
        .createTextQuestion({
          question: req.body.question,
          type: req.body.questionType,
          required: Boolean(req.body.required),
          order: req.body.order
        })
        .then(() => {
          res.status(200).json({
            message: "Text question created successfully."
          });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
