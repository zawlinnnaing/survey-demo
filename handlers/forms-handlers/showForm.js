const models = require("../../models");

module.exports = async (req, res, next) => {
  try {
    let form = await models.Form.findByPk(req.params.formId, {
      include: [
        {
          model: models.Question,
          as: "questions",
          order: [models.Question, "order", "asc"],
          attributes: {
            exclude: ["formId", "createdAt", "updatedAt"]
          },
          include: [
            {
              model: models.ListItem,
              as: "listItems",
              order: [models.ListItem, "order", "asc"],
              attributes: {
                exclude: ["questionId", "createdAt", "updatedAt"]
              }
            }
          ]
        }
      ]
    });
    res.status(200).json(form);
  } catch (e) {
    next(e);
  }
};
