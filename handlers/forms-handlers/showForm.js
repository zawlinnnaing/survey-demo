const models = require("../../models");

module.exports = async (req, res, next) => {
  try {
    let form = await models.Form.findByPk(req.params.formId, {
      include: [
        {
          model: models.Question,
          as: "questions",
          separate: true,
          attributes: {
            exclude: ["formId", "createdAt", "updatedAt"]
          },
          order: [["order", "ASC"]],
          include: [
            {
              model: models.ListItem,
              as: "listItems",
              separate: true,
              order: [["order", "ASC"]],
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
