let express = require("express");
let models = require("../models");
let router = express.Router();
let submitAnswerHandler = require("../handlers/forms-handlers/submitAnswer");
let updateFormHandler = require("../handlers/forms-handlers/updateForm");
const deleteFormHandler = require("../handlers/forms-handlers/deleteForm");
const showFormHandler = require("../handlers/forms-handlers/showForm");
const getFormsHandler = require("../handlers/forms-handlers/getForms");
const authMiddleware = require("../handlers/middlewares/auth");

router.get("/", getFormsHandler);

router.get("/:formId", (req, res, next) => {
  showFormHandler(req, res, next);
});

router.post("/", async (req, res, next) => {
  let { data } = req.body;
  try {
    const t = await models.sequelize.transaction();
    let form = await models.Form.create(
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
        ],
        transaction: t
      }
    );
    await t.commit();
    res.status(200).json({
      data: form
    });
  } catch (e) {
    await t.rollback();
    console.error(e);
    res.status(500).json(e);
  }
});

router.delete("/:formId", authMiddleware, (req, res, next) => {
  deleteFormHandler(req, res, next);
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
