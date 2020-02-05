const models = require("../../models");

module.exports = (req, res, next) => {
  models.Form.destroy({
    where: {
      id: req.params.formId
    }
  })
    .then(() => {
      res.status(200).json({ msg: "Deletion successful" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        msg: "Deletion failed"
      });
    });
};
