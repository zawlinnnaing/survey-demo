let express = require("express");
let models = require("../models");
let router = express.Router();
let submitAnswerHandler = require("../handlers/forms-handlers/submitAnswer");
let updateFormHandler = require("../handlers/forms-handlers/updateForm");
const deletFormHandler = require("../handlers/forms-handlers/deleteForm");
const showFormHandler = require("../handlers/forms-handlers/showForm");

router.get("/", (req, res, next) => {
  res.render("forms/index", { title: "Create a form" });
});

router.get("/:formId", (req, res, next) => {
  showFormHandler(req, res, next);
});

router.post("/", (req, res, next) => {
  let data = req.body;
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
  deletFormHandler(req, res, next);
});

router.put("/:formId", async (req, res, next) => {
  await updateFormHandler(req, res, next);
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
  submitAnswerHandler(req, res, next);
});

module.exports = router;
