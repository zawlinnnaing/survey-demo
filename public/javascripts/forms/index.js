let textQuestion = document.getElementById("create-text-question");

let questionsDiv = document.getElementById("questions-div");

let saveBtn = document.getElementById("save-form-btn");

let questionId = 1;
let questions = [];
let data = {};

textQuestion.onclick = event => {
  let { title, description } = retriveFormData();
  (data.title = title), (data.description = description);
  let questionObj = retriveTextQuestion(questionId);
  console.log(questionObj);
  createShortQuestion(
    questionObj.question,
    questionObj.required,
    questionObj.type,
    questionObj.order
  );
  questions.push(questionObj);
  clearTextQuestion();
  $("#shortQuestionModal").modal("hide");
};

function createShortQuestion(title, isRequired, questionType, questionId) {
  let topLevelElement = document.createElement("div");
  topLevelElement.setAttribute("class", "individual-question card");

  let questionHeader = document.createElement("div");
  questionHeader.setAttribute("class", "question-header");

  let questionTitle = document.createElement("h3");
  questionTitle.textContent = title;

  questionHeader.appendChild(questionTitle); // topLevelElement > questionHeader > questionTitle
  topLevelElement.appendChild(questionHeader);

  let questionBody = document.createElement("div");
  questionBody.setAttribute("class", "question-body form-group");
  if (questionType === "long") {
    let questionAnswer = document.createElement("textarea");
    setAttributes(questionAnswer, {
      class: "form-control text-area",
      name: "question-answer",
      col: "150",
      row: "10"
    });
    questionBody.appendChild(questionAnswer); // questionBody > questionAnswer
  } else {
    let questionAnswer = document.createElement("input");
    setAttributes(questionAnswer, {
      class: "form-control",
      name: "question-answer",
      place_holder: "Type your answer"
    });
    questionBody.appendChild(questionAnswer); // questionBody > questionAnswer
  }
  topLevelElement.appendChild(questionBody); //topLevelElement > questionBody > questionAnswer

  if (isRequired) {
    let questionFooter = document.createElement("div");
    setAttributes(questionFooter, {
      class: "question-footer"
    });
    questionFooter.innerText = "* Required";
    let deleteBtn = document.createElement("button"); // questionFooter > deleteBtn
    setAttributes(deleteBtn, {
      class: "btn btn-delete delete-question-btn",
      data_question_id: questionId,
      onclick: "deleteQuestion(this)"
    });
    deleteBtn.innerText = "Delete";
    questionFooter.appendChild(deleteBtn);
    topLevelElement.appendChild(questionFooter); // topLevelElement > questionFooter > deleteBtn
  }
  questionsDiv.appendChild(topLevelElement);
}

function setAttributes(el, obj) {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      key = String(key).replace("_", "-");
      el.setAttribute(key, obj[key]);
    }
  }
}

function retriveFormData() {
  let title = document.getElementById("form-title").value;
  let description = document.getElementById("form-description").value;
  return { title, description };
}

function retriveTextQuestion(questionId) {
  let obj = {};
  let questionTextValue = document.getElementById("question-text").value;
  if (questionTextValue == "") {
    alert("Question must not be empty");
    throw new Error("empty question");
  } else {
    obj.question = questionTextValue;
  }
  let questionRequiredValue = document.getElementById("question-required")
    .value;
  obj.required = questionRequiredValue ? 1 : 0;
  let questionTypeValue = getRadioBtnValue(
    document.getElementsByName("question-type")
  );
  obj.type = questionTypeValue;
  obj.order = questionId;
  return obj;
}

function clearTextQuestion() {
  $("#question-text").val("");
  $("question-required").val("");
  // $("input[name='question-type']").val("");
}

function getRadioBtnValue(element) {
  for (i = 0; i < element.length; i++) {
    if (element[i].checked) {
      return element[i].value;
    }
  }
}

function deleteQuestion(element) {
  element = $(element);
  removeQuestion(questions, element.data("question-id"));
  element
    .parent()
    .parent()
    .remove();
}

function removeQuestion(questions, questionId) {
  questions.splice(
    questions.findIndex(obj => obj.order == questionId),
    1
  );
}

// List questions

$("#create-list-question").on("click", event => {
  let listQuestionObj = retriveListQuetion();
  console.log(listQuestionObj);
});

function retriveListQuetion() {
  let obj = {};
  // console.log(""$("#checkbox-question-text"));
  let questionText = $("#checkbox-question-text").val();
  if (questionText == "" || questionText == null) {
    alert("Question text is required.");
    throw new Error("question text required");
  } else {
    obj.question = questionText;
  }
  let questionRequired = $("#checkbox-question-required").val();
  obj.required = questionRequired ? 1 : 0;
  obj.type = getRadioBtnValue(document.getElementsByName("listQuestionType"));
  let items = [];
  let checkboxOptions = $("input[name='checkbox-option']");
  console.log(checkboxOptions);
  for (let i = 0; i < checkboxOptions.length; i++) {
    items.push({
      itemName: $(checkboxOptions[i]).val()
    });
  }
  obj.listItems = items;
  return obj;
}

function createListQuestion(question, type, required, options) {
    
}
