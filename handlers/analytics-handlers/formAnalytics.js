let models = require("../../models");
// const excel = require("node-excel-export");
const x1 = require("excel4node");
const { listQuestionsTypes, textQuestionTypes } = require("../../config/app");

module.exports = async (req, res, next) => {
  let formId = req.params.formId;
  try {
    let form = await models.Form.findByPk(formId, {
      include: [
        {
          model: models.Question,
          as: "questions",
          attributes: ["id", "question", "type"],
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
    // console.log(typeof report);
    // res.attachment("report.xlsx");
    // res.sendFile(report);
    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `${form.title}.xlsx`
    );
    res.end(buildExcel(form));
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: "Something wrong"
    });
  }
};

/**
 * Build excel from database
 *
 *
 * @param {Form} form
 */
function buildExcel(form) {
  let workbook = new x1.Workbook();
  let worksheet = workbook.addWorksheet(form.title);
  return workbook.write("test" + ".xlsx");
  //   let headings = [];
  //   let specification = {};
  //   let questionsAnswers = {};
  //   form.questions.map((question, key) => {
  //     let questionTitle = question.question;
  //     headings.push({
  //       value: questionTitle,
  //       style: styles.headerDark
  //     });
  //     if (listQuestionsTypes.includes(question.type)) {
  //       questionsAnswers[questionTitle] = question.listAnswers.map(ele => {
  //         return ele.Items.map(ele => {
  //           return ele.itemName;
  //         });
  //       });
  //     } else if (textQuestionTypes.includes(question.type)) {
  //       questionsAnswers[questionTitle] = question.answers.map(ele => {
  //         return ele.answer;
  //       });
  //     }
  //     specification[questionTitle] = {
  //       displayName: questionTitle,
  //       headerStyle: styles.headerDark,
  //       cellStyle: () => {
  //         return key % 2 ? styles.cellBlue : styles.cellBlueDark;
  //       },
  //       width: String(questionTitle).length
  //     };
  //   });

  //   //   console.log(questionsAnswers);
  //   //   console.log(mergedArray(questionsAnswers));
  //   let dataset = mergedArray(questionsAnswers);
  //   //   unset()
  //   questionsAnswers = undefined;
  //   let merges = [];
  //   dataset.map((ele, index) => {
  //     let tempObj = {
  //       start: { row: ++index, column: 1 },
  //       end: { row: index, column: form.questions.length }
  //     };
  //     merges.push(tempObj);
  //   });
  //   console.log(merges);
  //   const report = excel.buildExport([
  //     {
  //       name: form.title,
  //       heading: headings,
  //       merges: merges,
  //       specification: specification,
  //       data: dataset
  //     }
  //   ]);
  //   return report;
}

/**
 * Merge multiple arrays to array of objects
 *
 * @param {Object} allAnswers
 * @returns {Array}
 */
function mergedArray(allAnswers) {
  let finalArray = [];
  let arrayLength = Object.keys(allAnswers)[0].length;
  for (let i = 0; i < arrayLength; i++) {
    let tempObj = {};
    Object.keys(allAnswers).map(key => {
      if (
        allAnswers[key][i] instanceof Array &&
        allAnswers[key][i].length > 0
      ) {
        tempObj[key] = allAnswers[key][i].toString();
      } else if (allAnswers[key][i] instanceof String) {
        tempObj[key] = allAnswers[key][i];
      } else {
        tempObj[key] = "";
      }
    });
    finalArray.push(tempObj);
  }
  return finalArray;
}
