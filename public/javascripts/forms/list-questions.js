let btnCounter = 2;

function addOptionField(event, parent) {
  $(parent).append(`
        <div class="form-group checkbox-option-field" id="checkbox-option-field-${btnCounter}">
        <p><i class="far fa-square"></i></p>
        <input class="form-control" type="text" name="checkbox-option" value="New option">
        <button class= "add-checkbox-btn btn btn-secondary" onclick="addOptionField(this,this.parentElement.parentElement)"> Add </button>
        <button class="remove-checkbox-btn btn btn-danger" onclick="removeOptionField(this)" data-btn-id=${btnCounter}"> Remove </button>
        </div>
  `);
  btnCounter++;
}

$(".add-checkbox-btn").on("click", event => {
  addOptionField(event, $(".checkbox-contents"));
});

function removeOptionField(element) {
  element = $(element);
  $(element)
    .parent()
    .remove();
}

function clearListQuestionField() {
  console.log("from clear list question field");
  btnCounter = 2;
  $("#checkbox-question-text").val("");
  $("#checkbox-question-required").prop("checked", false);
  $("input[name=listQuestionType][value='checkbox']").prop("checked", true);
  $(".checkbox-option-field")
    .not(":first")
    .remove();
}
