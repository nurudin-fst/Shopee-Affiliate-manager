const token = "5066885143:AAG6nmhxChXnJUEHJhHOVLSaBWhi7j-Z9rQ"
const SSID = "1xXK6yydOKskG3ELFeJl9Vny1YM-0Y_2uAkxTjLd9a6c"
const DATA_FIELD_NUMBER = 10
const COLUMN_ID_BARANG = 5
const COLUMN_COMMENT = 8
const COLUMN_LINK_AFFILIATE = 9
const COLUMN_PHOTO = 10

function doPost(e) {
  let data
  let updates
  let chatId
  if(e){  
    data = e.postData.getDataAsString()
    updates = JSON.parse(data)
    chatId = String(updates.message.from.id)
  }
  else{
    updates = {"update_id":68498888,
"message":{"message_id":24,"from":{"id":2018101950,"is_bot":false,"first_name":"Kenan","last_name":"Faresta","language_code":"en"},"chat":{"id":2018101950,"first_name":"Lisa","last_name":"Amane","type":"private"},"date":1638280592,"text":"/getall"}}
    chatId = String(updates.message.from.id)
  }
  let doc = SpreadsheetApp.openById(SSID)

  if(updates.message.photo){
    let photos = updates.message.photo
    if(updates.message.caption){
      let sheet = doc.getSheetByName(chatId)
      let result = addProductValue(sheet, COLUMN_PHOTO, updates.message.caption, photos[photos.length-1].file_id)
      if(result)
        sendText(chatId, "Foto berhasil di tambahkan")
      else
        sendText(chatId, "Foto gagal di tambahkan\ncaption harus berupa angka ID (5 digit) atau ID tidak di temukan")
    }
    else{
      sendText(chatId, `Foto berhasil di upload id file adalah ${photos[photos.length-1].file_id}`)
    }
  }
  else{
    let command = updates.message.text.match(/^\/\w+/i)
    if(command){
      let sheet
      switch(command[0]){
        case '/start': {
          if(!doc.getSheetByName(chatId)) {
            try {
              sheet = doc.insertSheet(chatId, doc.getNumSheets())
              let header = sheet.getRange(1, 1, 1, DATA_FIELD_NUMBER)
              header.setValues([["Timestamp", "Waktu",	"ID User",	"Nama",	"ID Barang",	"Produk",	"URL",	"Comment",	"Affiliate Link", "Foto"]])
            }
            catch(e){
              sendText(chatId, e)
            }
          }
          else
            sendText(chatId, `Selamat datang Kembali ${updates.message.from.first_name}`)
          break
        }
        case '/add': {
          sheet = doc.getSheetByName(chatId)
          let nextRow = sheet.getLastRow()+1
          let lastID = sheet.getRange(sheet.getLastRow(), COLUMN_ID_BARANG).getValue()
          if(typeof lastID === "string") lastID = +((doc.getNumSheets()-1+10)+'101')
          let newRow = managedPostData(updates, lastID+1)
          if(typeof newRow === "string"){
            sendText(chatId, newRow)
          }
          else {
            sheet.getRange(nextRow, 1, 1, sheet.getLastColumn()).setValues([newRow])
            sendText(chatId, `Data berhasil di tambahkan dengan ID barang : ${lastID+1}`)
          }
          break
        }
        case '/getall':{
          let data = getAllData(doc, chatId)
          let result = ''
          data.forEach((product) =>{
            result += `${product[0]}\n${product[1]}\n${product[2]}\n\n`
          })
          sendText(chatId, result)
          break
        }
        case '/getproduct':{
          let idBarang = updates.message.text.split(' ')[1]
          let sheet = doc.getSheetByName(chatId)
          let result = getDataProduct(sheet, idBarang)
          sendText(chatId, result)
          break
        }
        case '/setlink':{
          let sheet = doc.getSheetByName(chatId)
          let data = updates.message.text.split(' ')
          console.log(data[2])
          let send = addProductValue(sheet, COLUMN_LINK_AFFILIATE, data[1], data[2])
          if(send)
            sendText(chatId, 'Link telah di tambahkan')
          else
            sendText(chatId, 'ID Produk tidak di temukan')
          break
        }
        case '/setphoto':{
          let sheet = doc.getSheetByName(chatId)
          let data = getDataTextMessage(updates.message.text)
          let send = addProductValue(sheet, COLUMN_PHOTO, data[1], data[2])
          if(send)
            sendText(chatId, 'Photo telah di tambahkan')
          else
            sendText(chatId, 'ID Produk tidak di temukan')
          break
        }
        case '/get':{
          let sheet = doc.getSheetByName(chatId)
          let data = getDataTextMessage(updates.message.text)
          let result = getProduct(sheet, data[1])
          if(result){
            let view = `${result[0]}\n${result[1]}\n\n${result[2]}`
            sendText(chatId, view)
            let photos = result[3].split('\n')
            photos.forEach(photo =>{
              sendPhoto(chatId, photo)
            })
          }
          else
            sendText(chatId, "ID Tidak di temukan")
          break
        }
        case '/editcomment':{
          let sheet = doc.getSheetByName(chatId)
          let data = getDataTextMessage(updates.message.text)
          let result = setComment(sheet, data[1], data[2])
          console.log(result)
          if(result)
            sendText(chatId, 'Komentar telah di ubah')
          else
            sendText(chatId, 'ID Produk tidak di temukan')
          break
        }
        default :{
          sendText(chatId, 'Perintah yang di masukkan salah')
        }
      }
    }
    else {
      sendText(chatId, 'Mohon masukkan perintah di awal tulisan\n\nDaftar perintah:\n/add\n/getall\n/getproduct\n/setlink\n/setphoto\n/get\n/editcomment')
    }
  }
}