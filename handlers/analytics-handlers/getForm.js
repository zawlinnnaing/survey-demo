const models = require("../../models");

/**
 *
 * @param {Number} formId
 * @return {Promise}
 */
module.exports = async formId => {
  return await models.Form.findByPk(formId, {
    include: [
      {
        model: models.Question,
        as: "questions",
        attributes: ["id", "question", "type"],
        order: [["order", "ASC"]],
        include: [
          {
            model: models.ListAnswer,
            as: "listAnswers",
            attributes: ["id"],
            include: [
              {
                model: models.ListItem,
                as: "Items",
                attributes: ["id", "itemName"]
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
};
