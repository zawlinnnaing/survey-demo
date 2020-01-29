const getForm = require("./getForm");
const models = require("../../models");

module.exports = async (req, res, next) => {
  try {
    let formId = req.params.formId;
    let form = await models.Form.findByPk(formId, {
      include: [
        {
          model: models.Question,
          as: "questions",
          attributes: ["id", "question", "type"],
          order: [["order", "ASC"]],
          include: [
            {
              model: models.ListItem,
              as: "listItems",
              attributes: ["id", "itemName"],

              include: [
                {
                  model: models.ListAnswer,
                  as: "Answers",
                  through: {
                    attributes: []
                  },
                  attributes: ["id"]
                }
              ]
            },
            {
              model: models.TextAnswer,
              as: "answers"
            }
          ]
        }
      ]
    });
    res.status(200).json(form);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};
