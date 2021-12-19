function getAllData(document, userID){
  let sheet = document.getSheetByName(userID)
  return sheet.getRange(2, 5, sheet.getLastRow()-1, 3).getValues()
}

function getRowByIDProduct(sheet, id){
  let range = sheet.getRange(2, 5, sheet.getLastRow()-1, 1).getValues()
  let row = 0
  let n = range.length-1
  while(n >= 0){
    if(range[n][0] == id){
      return row = n+2// 2 mean header must be count and index of cell begin with 1 not 0
    }
    n--
  }
  return row
}

function getDataProduct(sheet, id){
  if(sheet.getLastRow === 1) return "ID tidak di temukan"
  let result = ''
  let row = getRowByIDProduct(sheet, id)
  if(row === 0) return "ID tidak di temukan"
  let range = sheet.getRange(row, 5, 1, 5).getValues()[0]
  for(let i=0; i<range.length; i++){
    result += range[i]+'\n'
  }
  return result
}

function getProduct(sheet, id){
  if(sheet.getLastRow === 1) return false
  let row = getRowByIDProduct(sheet, id)
  if(row === 0) return false
  let result = [String(id)]
  let range = sheet.getRange(row, 8, 1, 3).getValues()[0]
  for(let i=0; i<range.length; i++){
    result.push(range[i])
  }
  return result

}

function addProductValue(sheet, column, idProduct, data){
  let row = getRowByIDProduct(sheet, idProduct)
  if(row === 0) return false
  let value = sheet.getRange(row, column, 1, 1).getValues()[0][0]
  let result = (value == '') ? '' : '\n'
  result += data
  value += result
  sheet.getRange(row, column, 1 ,1).setValues([[value]])
  return true
}

function setComment(sheet, idProduct, comment){
  let row = getRowByIDProduct(sheet, idProduct)
  if(row === 0) return false
  let range = sheet.getRange(row, COLUMN_COMMENT, 1, 1)
  comment = comment.replaceAll("_", " ")
  sheet.getRange(row, COLUMN_COMMENT, 1, 1).setValues([[comment]])
  return true
}

function testSetComment(){
  let doc = SpreadsheetApp.openById(SSID)
  let sheet = doc.getSheetByName(CHAT_ID)
  console.log(setComment(sheet, 8765, 'bbbbb'))
}
