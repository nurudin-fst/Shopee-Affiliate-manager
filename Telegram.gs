function sendText(chatID, text, replymarkup) {
  let data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatID),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(replymarkup)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data)
}
function sendPhoto(chatID, photo){
  let data = {
    method: "post",
    // contentType: "multipart/form-data",
    payload: {
      method: "sendPhoto",
      chat_id: chatID,
      photo: photo
    }
  }
  UrlFetchApp.fetch('https://api.telegram.org/bot'+ token +'/', data)
}