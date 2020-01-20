let express = require("express");
let models = require("../models");
let { listQuestionsTypes, textQuestionTypes } = require("../config/app");
let router = express.Router();
const { Op } = require("sequelize");

router.get("/", (req, res, next) => {
  res.render("forms/index", { title: "Create a form" });
});
router.post("/", (req, res, next) => {
  let data = req.body;

  // console.log(questions);
  models.Form.create(
    {
      title: data.title,
      description: data.description,
      questions: data.questions
    },
    {
      include: [
        {
          association: models.Form.associations.questions,
          as: "questions",
          include: [{ model: models.ListItem, as: "listItems" }]
        }
      ]
    }
  )
    .then(form => {
      // questions.forEach(element => {
      //   console.log(element.items);
      //   form
      //     .createQuestion({
      //       question: element.question,
      //       type: element.type,
      //       required: element.required,
      //       order: element.order
      //     })
      //     .then(question => {
      //       // console.log(typeof question);
      //       if (element.items && listQuestionsTypes.includes(element.type)) {
      //         console.log(element.items);
      //         //   // console.log(element);
      //         //   // question.listItems = element.items;
      //         //   // question.save();
      //         element.items.forEach(item => {
      //           question.createListItem(item);
      //         });
      //       }
      //     })
      //     .catch(err => {
      //       console.error(err);
      //     });
      // });
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

// router.post("/:formId/text-questions", (req, res, next) => {
//   models.Form.findOne({
//     where: {
//       id: req.params.formId
//     }
//   })
//     .then(form => {
//       form
//         .createTextQuestion({
//           question: req.body.question,
//           type: req.body.questionType,
//           required: Boolean(req.body.required),
//           order: req.body.order
//         })
//         .then(() => {
//           res.status(200).json({
//             message: "Text question created successfully."
//           });
//         });
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

router.post("/:formId/answers", (req, res, next) => {
  let data = req.body;
  models.Form.findOne({
    where: {
      id: req.params.formId
    },
    include: [
      {
        model: models.Device,
        as: "Devices",
        required: false,
        attributes: ["sessionId"]
      },
      {
        model: models.Question,
        as: "questions",
        order: [models.Question, "order", "desc"]
      }
    ]
  })
    .then(form => {
      form.Devices.forEach(device => {
        
        if (String(device.sessionId) == String(req.session.id)) {
          res.status(422).json({
            error: "You have already answered this survey"
          });
        }
      });
      models.Device.findOrCreate({
        where: {
          sessionId: req.session.id
        }
      })
        .then(([device, created]) => {
          form.addDevice(device, {
            through: {
              status: "completed"
            }
          });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({
            error: err
          });
        });
      let questionIds = data.map(ele => {
        return ele.questionId;
      });
      console.log("Question ids from request", questionIds);
      console.log(
        "questions id from database",
        form.questions.map(element => element.id)
      );
      if (
        JSON.stringify(questionIds) !==
        JSON.stringify(form.questions.map(ele => ele.id))
      ) {
        res.status(403).json({
          error: "Invalid questions contained."
        });
      }
      data.forEach(element => {
        models.Question.findOne({
          where: {
            id: element.questionId
          }
        }).then(question => {
          if (question.required) {
            if (
              textQuestionTypes.includes(question.type) &&
              !element.textAnswer &&
              element.textAnswer == ""
            ) {
              res.status(403).json("Invalid answer");
            } else if (
              listQuestionsTypes.includes(question.type) &&
              !element.listAnswers &&
              element.listAnswers.length <= 0
            ) {
              res.status(403).json("Invalid answer");
            }
          }
          if (
            textQuestionTypes.includes(question.type) &&
            element.textAnswer != ""
          ) {
            question.createAnswer({
              answer: element.textAnswer
            });
          }
          if (
            listQuestionsTypes.includes(question.type) &&
            element.listAnswers.length >= 0
          ) {
            question
              .createListAnswer({
                createdAt: new Date(),
                updateAt: new Date()
              })
              .then(listAnswerModel => {
                element.listAnswers.forEach(ele => {
                  models.ListItem.findOne({
                    where: {
                      id: ele.listItemId
                    }
                  }).then(listItem => {
                    listAnswerModel.addItem(listItem);
                  });
                });
              });
          }
        });
      });
      res.status(200).json({
        msg: "Answers submitted successfully"
      });
    })
    .catch(err => {
      console.error(err);
      res.status(422).json({
        error: "Form finding failed "
      });
    });
});

module.exports = router;
