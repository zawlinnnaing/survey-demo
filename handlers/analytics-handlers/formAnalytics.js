const x1 = require("excel4node");
const { listQuestionsTypes, textQuestionTypes } = require("../../config/app");
const fs = require("fs");
const getForm = require("./getForm");

module.exports = async (req, res, next) => {
  let formId = req.params.formId;
  try {
    let form = await getForm(formId);
    console.log("Form model", form);
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
function buildExcel(form, res) {
  let workbook = new x1.Workbook();
  let worksheet = workbook.addWorksheet(String(form.title), {
    sheetFormat: {}
  });
  workbook.createStyle({
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

  let dataset = mergedArray(questionsAnswers);
  console.log("Dataset", dataset);

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
