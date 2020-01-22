let express = require("express");
let models = require("../models");
let {listQuestionsTypes, textQuestionTypes} = require("../config/app");
let router = express.Router();
const {Op} = require("sequelize");

router.get("/", (req, res, next) => {
    res.render("forms/index", {title: "Create a form"});
});
router.post("/", (req, res, next) => {
    let data = req.body;

    // console.log(questions);
    models.Form.create(
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
                    include: [{model: models.ListItem, as: "listItems"}]
                }
            ]
        }
    )
        .then(form => {
            // questions.forEach(element => {
            //   console.log(element.items);
            //   form
            //     .createQuestion({
            //       question: element.question,
            //       type: element.type,
            //       required: element.required,
            //       order: element.order
            //     })
            //     .then(question => {
            //       // console.log(typeof question);
            //       if (element.items && listQuestionsTypes.includes(element.type)) {
            //         console.log(element.items);
            //         //   // console.log(element);
            //         //   // question.listItems = element.items;
            //         //   // question.save();
            //         element.items.forEach(item => {
            //           question.createListItem(item);
            //         });
            //       }
            //     })
            //     .catch(err => {
            //       console.error(err);
            //     });
            // });
            res.status(200).json({
                data: form
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete("/:formId", (req, res, next) => {
    let id = req.params.formId;
    models.Form.destroy({
        where: {
            id: id
        }
    })
        .then(() => {
            res.status(200).json({msg: "Deletion successful"});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                msg: "Deletion failed"
            });
        });
});

router.put("/:formId", (req, res, next) => {
    let data = req.body;
    let id = req.params.formId;
    models.Form.findOne({
        where: {
            id: req.params.formId
        },
        include: [
            {
                model: models.Question,
                as: "questions",
                include: {
                    model: models.ListItem,
                    as: "listItems"
                }
            }
        ]
    })
        .then(form => {
            form.title = data.title;
            form.description = data.description;
            form.save();
            // let questionIds =
            data.questions.forEach(element => {
                form.questions.update(element);
            });
            res.end();
        })
        .catch(err => {
            console.error(err);
            res.status(422).json({
                error: err.message
            });
        });
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

router.post("/:formId/answers", async (req, res, next) => {
    let data = req.body;
    models.sequelize.transaction().then(async t => {
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
                    order: [models.Question, "order", "desc"]
                }
            ]
        });
        form.Devices.forEach(device => {
            if (String(device.sessionId) == String(req.session.id)) {
                throw new Error("Survey already submitted.");
            }
        });
        let device = await models.Device.findOrCreate({
            where: {
                sessionId: req.session.id
            },
            transaction: t
        });
        form.addDevice(device, {
            through: {
                status: "completed"
            }
        });
        let questionIds = data.map(ele => {
            return ele.questionId;
        });
        if (
            JSON.stringify(questionIds) !==
            JSON.stringify(form.questions.map(ele => ele.id))
        ) {
            throw new Error("Invalid question contained");
        }
        for (let i = 0; i < data.length; i++) {
            let question = await models.Question.findOne({
                where: {
                    id: data[i].questionId
                }
            });
            if (question.required) {
                if (
                    textQuestionTypes.includes(question.type) &&
                    (data[i].textAnswer === undefined ||
                        data[i].textAnswer == null ||
                        String(data[i].textAnswer )=== "")
                ) {
                    // res.status(403).json("Invalid answer");
                    console.log("In text answer invalid");
                    throw new Error("Invalid Text answer");
                } else if (
                    listQuestionsTypes.includes(question.type) &&
                    (data[i].listAnswers === undefined ||
                        data[i].listAnswers === null ||
                        data[i].listAnswers.length <= 0)
                ) {
                    console.log("in list answers invalid");
                    throw new Error("Invalid List answers");
                }
            }
            if (
                textQuestionTypes.includes(question.type) &&
                String(data[i].textAnswer) !== ""
            ) {
                question.createAnswer(
                    {
                        answer: data[i].textAnswer
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
                let listAnswerModel = await question.createAnswer({
                    createdAt: new Date()
                }, {transaction: t});
                for (let j = 0; j < data[i].listAnswers.length; j++) {
                    let listItem = await models.listItem.findOne({
                        where: {
                            id: data[i].listAnswers[j].listItemId
                        }
                    });
                    listAnswerModel.addItem(listItem);
                }
            }

        }
        res.status(200).json({
            msg: "Answers submitted successfully"
        })

    })
        .catch(err => {
            next(err);
        });

});


module.exports = router;
