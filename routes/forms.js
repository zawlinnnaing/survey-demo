let express = require("express");
let models = require("../models");
let router = express.Router();
let submitAnswerHandler = require("../handlers/forms-handlers/submitAnswer");
let updateFormHandler = require("../handlers/forms-handlers/updateForm");
const deleteFormHandler = require("../handlers/forms-handlers/deleteForm");
const showFormHandler = require("../handlers/forms-handlers/showForm");
const getFormsHandler = require("../handlers/forms-handlers/getForms");
const getAnswerLinksHandler = require("../handlers/forms-handlers/getAnswerLinks");
const authMiddleware = require("../handlers/middlewares/auth");

const { validateGenerateAnswerTokens } = require("./validators/FormValidator");

router.get("/", authMiddleware, getFormsHandler);

router.get("/:formId", (req, res, next) => {
  showFormHandler(req, res, next);
});

// Generate tokens
router.post(
  "/:formId/tokens",
  authMiddleware,
  validateGenerateAnswerTokens,
  async (req, res, next) => {
    try {
      let formId = req.params.formId;
      let request = req.body;
      let form = await models.Form.findByPk(formId);
      let tokens = await models.FormAccessToken.generateTokens(
        form,
        Number(request.count)
      );
      res.status(200).json({
        tokens
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);

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

router.get("/:formId/links", authMiddleware, getAnswerLinksHandler);

router.post("/:formId/answers/:token", (req, res, next) => {
  submitAnswerHandler(req, res, next);
});

module.exports = router;
