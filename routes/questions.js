let router = require("express").Router();
let models = require("../models");

router.delete("/:questionId/forms/:formId", async (req, res, next) => {
  try {
    let question = await models.Question.findOne({
      where: {
        formId: req.params.formId,
        id: req.params.questionId
      }
    });
    await question.destroy();
    res.status(200).json({
      msg: "question deleted successfully"
    });
  } catch (e) {
    console.error(e);
    res.status(422).json({
      error: "Something went wrong."
    });
  }
});

router.delete("/:questionId/list-items/:itemId", async (req, res, next) => {
  try {
    let listItem = await models.ListItem.findOne({
      where: {
        listQuestionId: req.params.questionId,
        id: req.params.itemId
      }
    });
    listItem.destroy();
    res.status(200).json({
      msg: "List item deleted successfully"
    });
  } catch (e) {
    console.error(e);
    res.status(422).json({
      error: "Something went wrong."
    });
  }
});

module.exports = router;
