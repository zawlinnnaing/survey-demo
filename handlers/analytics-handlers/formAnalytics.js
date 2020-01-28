let models = require("../../models");
// const excel = require("node-excel-export");
const x1 = require("excel4node");
const { listQuestionsTypes, textQuestionTypes } = require("../../config/app");
const fs = require("fs");

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

    buildExcel(form, res);
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
 * @param {Response}
 */
async function buildExcel(form, res) {
  let workbook = new x1.Workbook();
  let worksheet = workbook.addWorksheet(String(form.title), {
    sheetFormat: {}
  });
  let style = workbook.createStyle({
    font: {
      color: "#FFFFFF",
      size: 12
    }
  });
  let questionsAnswers = {};
  form.questions.map((question, key) => {
    let questionTitle = question.question;
    if (listQuestionsTypes.includes(question.type)) {
      questionsAnswers[questionTitle] = question.listAnswers.map(ele => {
        return ele.Items.map(ele => {
          return ele.itemName;
        });
      });
    } else if (textQuestionTypes.includes(question.type)) {
      questionsAnswers[questionTitle] = question.answers.map(ele => {
        return ele.answer;
      });
    }
  });

  // console.log(questionsAnswers);

  let dataset = mergedArray(questionsAnswers);
  console.log(dataset);

  let row = 1;
  let column = 1;
  Object.keys(dataset[0]).map(key => {
    // Setting question as header for worksheet
    worksheet
      .cell(row, column)
      .string(String(key))
      .style({
        font: {
          size: 24
        }
      });
    column++;
  });
  row++, (column = 1);
  dataset.map(ele => {
    // Get each element from array dataset
    (column = 1), (cellStyle = {});
    Object.keys(ele).map(key => {
      // Get each key from element object
      if (column % 2 == 0) {
        cellStyle.fill = {
          type: "pattern",
          fgColor: "#90CAF9"
        };
      } else {
        cellStyle.fill = {
          type: "pattern",
          fgColor: "#0D47A1"
        };
      }
      worksheet
        .cell(row, column)
        .string(ele[key])
        .style(cellStyle);
      column++;
    });
    row++;
  });
  workbook.write(`${form.title}.xlsx`, res);
}

/**
 * Merge multiple arrays to array of objects
 *
 * @param {Object} allAnswers
 * @returns {Array}
 */
function mergedArray(allAnswers) {
  let finalArray = [];
  let arrayLength = allAnswers[Object.keys(allAnswers)[0]].length;
  for (let i = 0; i < arrayLength; i++) {
    let tempObj = {};
    Object.keys(allAnswers).map(key => {
      console.log(
        "key : ",
        key,
        "\n",
        "index :",
        i,
        "\n",
        "value :",
        allAnswers[key][i],
        "\n",
        "Instance: ",
        typeof allAnswers[key][i]
      );
      if (
        allAnswers[key][i] instanceof Array &&
        allAnswers[key][i].length > 0
      ) {
        tempObj[key] = allAnswers[key][i].toString();
      } else if (allAnswers[key][i]) {
        tempObj[key] = String(allAnswers[key][i]);
      } else {
        tempObj[key] = "";
      }
    });
    finalArray.push(tempObj);
  }
  return finalArray;
}
