const models = require("../../models");
const { listQuestionsTypes, textQuestionTypes } = require("../../config/app");
const { checkMatchRecords } = require("../../helpers/helpers");

module.exports = async (req, res, next) => {
  let data = req.body;
  const t = await models.sequelize.transaction();
  try {
    let form = await models.Form.findOne({
      where: {
        id: req.params.formId
      },
      include: [
        {
          model: models.Question,
          as: "questions"
        }
      ],
      transaction: t
    });
    form.title = data.title;
    form.description = data.description;
    await form.save({ transaction: t });
    let questionIds = data.questions
      .filter(ele => {
        return ele.hasOwnProperty("questionId") && ele.questionId;
      })
      .map(ele => ele.questionId);
    console.log("Question ids from input", questionIds);
    checkMatchRecords(questionIds, form);
    for (element of data.questions) {
      // For Text Questions
      if (textQuestionTypes.includes(String(element.type))) {
        // If Text question already exists
        if (element.hasOwnProperty("questionId")) {
          await models.Question.update(element, {
            where: {
              id: element.questionId
            },
            transaction: t
          });
        } else {
          // If text question does not exist.
          await form.createQuestion(element, { transaction: t });
        }
      } else if (listQuestionsTypes.includes(element.type)) {
        // For List Questions
        if (element.listItems.length <= 0)
          throw new Error("Empty options for question :" + element.question);

        // if list question exists.
        if (element.hasOwnProperty("questionId")) {
          let listIds = element.listItems
            .filter(ele => ele.hasOwnProperty("listItemId") && ele.listItemId)
            .map(ele => ele.listItemId);
          let listQuestion = await models.Question.findByPk(
            element.questionId,
            {
              include: [
                {
                  model: models.ListItem,
                  as: "listItems"
                }
              ],
              transaction: t
            }
          );
          checkMatchRecords(listIds, listQuestion, "listItems");
          listQuestion.question = element.question;
          listQuestion.type = element.type;
          listQuestion.required = element.required;
          listQuestion.order = element.order;
          await listQuestion.save({ transaction: t });
          for (listElement of element.listItems) {
            if (listElement.hasOwnProperty("listItemId")) {
              //  If list item exists.
              await models.ListItem.update(listElement, {
                where: {
                  id: listElement.listItemId
                },
                transaction: t
              });
            } else {
              // If list item does not exists
              await listQuestion.createListItem(listElement, {
                transaction: t
              });
            }
          }
        } else {
          // If List question does not exist.
          element.formId = form.id;
          await models.Question.create(element, {
            include: [
              {
                model: models.ListItem,
                as: "listItems"
              }
            ],
            transaction: t
          });
        }
      }
    }
    await t.commit();
    res.status(200).json({
      msg: "Form updated successfully."
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
