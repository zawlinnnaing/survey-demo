/**
 * Check if input records match with database
 *
 * @param {Array} inputIds
 * @param {Object} dbModel
 *
 * @throws Error
 */
function checkMatchRecords(inputIds, dbModel, key = "questions") {
  if (!dbModel.hasOwnProperty(key)) {
    throw new Error("Form does not has any questions");
  }
  console.log(
    "IDs from db",
    dbModel[key].map(ele => ele.id)
  );
  console.log("IDs from input", inputIds);
  if (
    JSON.stringify(inputIds.sort()) !==
    JSON.stringify(dbModel[key].map(ele => ele.id).sort())
  ) {
    throw new Error(`Invalid  ${key} contained`);
  }
}

module.exports = { checkMatchRecords };
