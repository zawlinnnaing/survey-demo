const models = require("../../models");
let { listQuestionsTypes, textQuestionTypes } = require("../../config/app");
const { checkMatchRecords } = require("../../helpers/helpers");

async function submitAnswer(req, res, next) {
  let data = req.body;
  const t = await models.sequelize.transaction();
  try {
    let form = await models.Form.findOne({
      where: {
        id: req.params.formId
      },
      transaction: t,
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
          order: [models.Question, "order", "desc"],
          required: false
        }
      ]
    });
    form.Devices.forEach(device => {
      if (String(device.sessionId) === String(req.session.id)) {
        throw new Error("Survey already submitted.");
      }
    });
    let device = await models.Device.findOrCreate({
      where: {
        sessionId: req.session.id
      },
      defaults: {
        createdAt: new Date(),
        updatedAt: new Date()
      },
      transaction: t
    });
    await form.addDevice(device[0], {
      through: {
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      transaction: t
    });
    let questionIds = data.map(ele => {
      return ele.questionId;
    });
    checkMatchRecords(questionIds, form);

    for (let i = 0; i < data.length; i++) {
      let question = await models.Question.findOne({
        where: {
          id: data[i].questionId
        },
        transaction: t
      });
      if (question.required) {
        // If question is required
        if (
          textQuestionTypes.includes(question.type) &&
          (data[i].textAnswer === undefined ||
            data[i].textAnswer === null ||
            String(data[i].textAnswer) === "")
        ) {
          throw new Error("Invalid Text answer at ", question.question );
        } else if (
          listQuestionsTypes.includes(question.type) &&
          (data[i].listAnswers === undefined ||
            data[i].listAnswers === null ||
            data[i].listAnswers.length <= 0)
        ) {
          throw new Error(
            "Invalid List answers at " + question.question
          );
        }
      }
      if (textQuestionTypes.includes(question.type)) {
        await question.createAnswer(
          {
            answer: String(data[i].textAnswer) ? String(data[i].textAnswer) : ""
          },
          {
            transaction: t
          }
        );
      }
      if (
        listQuestionsTypes.includes(question.type) &&
        data[i].listAnswers.length >= 0
      ) {
        let listAnswerModel = await question.createListAnswer(
          {
            createdAt: new Date()
          },
          { transaction: t }
        );
        for (let j = 0; j < data[i].listAnswers.length; j++) {
          let listItem = await models.ListItem.findOne({
            where: {
              id: data[i].listAnswers[j].listItemId
            },
            transaction: t
          });
          await listAnswerModel.addItem(listItem, {
            transaction: t
          });
        }
      }
    }
    await t.commit();
    res.status(200).json({
      msg: "Answers submitted successfully"
    });
  } catch (err) {
    await t.rollback();
    res.status(400).json({
      message: err.message
    });
  }
}

module.exports = submitAnswer;
