let textQuestion = document.getElementById("create-text-question");
let listQuestion = document.getElementById("create-list-question");

let questionsDiv = document.getElementById("questions-div");

let saveBtn = document.getElementById("save-form-btn");

let questionId = 1;
let questions = [];
let data = {};

saveBtn.onclick = event => {
  let { title, description } = retriveFormData();
  (data.title = title), (data.description = description);
  data.questions = questions;
  console.log("form data", data);
};

textQuestion.onclick = event => {
  let questionObj = retriveTextQuestion(questionId);
  // console.log("Text Question", questionObj);
  createShortQuestion(
    questionObj.question,
    questionObj.required,
    questionObj.type,
    questionObj.order
  );
  questions.push(questionObj);
  questionId++;
  clearTextQuestion();
  $("#shortQuestionModal").modal("hide");
};

listQuestion.onclick = event => {
  let questionObj = retriveListQuestion();
  console.log("List question obj", questionObj);
  createListQuestion(
    questionObj.question,
    questionObj.type,
    questionObj.required,
    questionObj.listItems,
    questionObj.order
  );
  questions.push(questionObj);
  questionId++;
  console.log("Questions from list button", questions);
  clearListQuestionField();
  $("#checkBoxQuestionModal").modal("hide");
};

function createShortQuestion(title, isRequired, questionType, questionId) {
  let topLevelElement = createQuesitonHeader(
    title,
    isRequired,
    questionType,
    questionId
  );

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

  topLevelElement = createQuestionFooter(
    topLevelElement,
    isRequired,
    questionId
  );
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

function retriveListQuestion() {
  let obj = {};
  let questionText = $("#checkbox-question-text").val();
  if (questionText == "" || questionText == null) {
    alert("Question text is required.");
    throw new Error("question text required");
  } else {
    obj.question = questionText;
  }
  let questionRequired = $("#checkbox-question-required").is(":checked");
  console.log("Is required", questionRequired);
  obj.required = questionRequired ? 1 : 0;
  obj.type = getRadioBtnValue(document.getElementsByName("listQuestionType"));
  obj.order = questionId;
  let items = [];
  let checkboxOptions = $("input[name='checkbox-option']");
  // console.log("List options ", checkboxOptions);
  for (let i = 0; i < checkboxOptions.length; i++) {
    items.push({
      itemName: $(checkboxOptions[i]).val()
    });
  }
  obj.listItems = items;
  return obj;
}

function createListQuestion(question, type, required, options, questionId) {
  let topLevelElement = createQuesitonHeader(question, required, type);
  let questionBody = document.createElement("div");
  setAttributes(questionBody, {
    class: "question-body"
  });
  if (String(type) === "checkbox") {
    constructCheckbox(options, questionBody);
  } else if (String(type) === "dropdown") {
    constructDropDown(options, questionBody);
  } else {
    constructCheckbox(options, questionBody, "radio");
  }
  topLevelElement.appendChild(questionBody);
  createQuestionFooter(topLevelElement, required, questionId);
  questionsDiv.appendChild(topLevelElement);
}

function createQuesitonHeader(title, isRequired, questionType, questionId) {
  let topLevelElement = document.createElement("div");
  topLevelElement.setAttribute("class", "individual-question card");

  let questionHeader = document.createElement("div");
  questionHeader.setAttribute("class", "question-header form-group");

  let questionTitle = document.createElement("input");
  setAttributes(questionTitle, {
    class: "form-control",
    type: "text",
    value: title,
    id: "question-title-" + questionId,
    data_question_id: questionId,
    disabled: true
  });

  questionHeader.appendChild(questionTitle); // topLevelElement > questionHeader > questionTitle
  topLevelElement.appendChild(questionHeader);
  return topLevelElement;
}

function createQuestionFooter(topLevelElement, isRequired, questionId) {
  let questionFooter = document.createElement("div");
  setAttributes(questionFooter, {
    class: "question-footer"
  });
  if (isRequired) {
    questionFooter.innerText = "* Required";
  }
  let deleteBtn = document.createElement("button"); // questionFooter > deleteBtn
  setAttributes(deleteBtn, {
    class: "btn btn-danger delete-question-btn",
    data_question_id: questionId,
    onclick: "deleteQuestion(this)"
  });
  deleteBtn.innerText = "Delete";
  questionFooter.appendChild(deleteBtn);

  let editBtn = document.createElement("button");
  setAttributes(editBtn, {
    class: "btn btn-secondary edit-question-btn",
    data_question_id: questionId,
    onclick: "editQuestion(this)"
  });
  topLevelElement.appendChild(questionFooter); // topLevelElement > questionFooter > deleteBtn

  return topLevelElement;
}

function constructDropDown(options, questionBody) {
  let formGroup = document.createElement("div");
  setAttributes(formGroup, {
    class: "form-group"
  });
  let seleteElement = document.createElement("select");
  setAttributes(seleteElement, {
    class: "custom-select"
  });
  for (option of options) {
    let optionElement = document.createElement("option");
    optionElement.innerText = option.itemName;
    seleteElement.appendChild(optionElement);
  }
  formGroup.appendChild(seleteElement);
  questionBody.appendChild(formGroup);
}

function constructCheckbox(options, questionBody, type = "checkbox") {
  let checkboxGroup = document.createElement("div");
  setAttributes(checkboxGroup, {
    class: "checkbox-group-for-questions"
  });
  for (option of options) {
    let formGroup = document.createElement("div");
    setAttributes(formGroup, {
      class: "form-group"
    });
    let formCheck = document.createElement("div");
    setAttributes(formCheck, {
      class: "form-check"
    });
    let inputCheck = document.createElement("input");
    setAttributes(inputCheck, {
      type: type,
      class: "form-check-input",
      name: "checkbox-for-" + questionId
    });
    let label = document.createElement("label");
    label.innerText = option.itemName;
    setAttributes(label, {
      class: "form-check-label"
    });
    formCheck.appendChild(inputCheck);
    formCheck.appendChild(label);
    formGroup.appendChild(formCheck);
    checkboxGroup.appendChild(formGroup);
  }
  questionBody.appendChild(checkboxGroup);
}

function editQuestionTitle(questionId) {}

function setQuestionTitle(element) {
  let newValue = element.value;
  let questionId = element.dataset.questionId;
  data.questions.forEach(element => {
    if (element.order == questionId) {
      element.question = newValue;
    }
  });
}
