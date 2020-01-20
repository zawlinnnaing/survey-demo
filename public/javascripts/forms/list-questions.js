console.log("from list question js");
let addCheckBoxBtn = $(".add-checkbox-btn");
let btnCounter = 2;

function addOptionField(event,parent) {
  console.log("from add option field");
  parent.append(`
        <div class="form-group checkbox-option-field">
        <p><i class="far fa-square"></i></p>
        <input class="form-control" type="text" name="checkbox-option" value="option ${btnCounter}">
        </div>
  `);
  btnCounter++;
}



addCheckBoxBtn.on("click", event => {
  addOptionField(event,$(".checkbox-contents"));
});
