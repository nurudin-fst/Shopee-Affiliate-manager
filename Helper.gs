function getDataTextMessage(textMessage){
  textMessage = textMessage.trim()
  textMessage = textMessage.replace( /\s\s+/g, ' ' )
  let messageData = textMessage.split(' ')
  return messageData
}

function managedPostData(data, newID){ // Array
  try{
    let message = getDataTextMessage(data.message.text)
    if(message.length < 3) throw "Komentar harus di isi setelah URL"
    if(message.length >= 4 && !/^https:\/\/shp.ee\//i.test(message[3])) throw "Spasi pada komentar harus di ganti dengan garis bawah \"_\""
    let d = new Date(data.message.date*1000)
    let time = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    console.log(message)
    let productName = message[1].match(/(?<=co\.id\/).*(?=-i\.)/i)
    let idProduct = newID
    let link = message[1].match(/^https:\/\/shopee.co.id.*\?/i)
    let result = [String(data.message.date),
                  time,
                  String(data.message.from.id),
                  `${data.message.from.first_name} ${data.message.from.last_name}`,
                  idProduct,
                  productName[0].replaceAll('-', ' '),
                  link ? link[0].replace('?', '') : message[1],
                  message[2].replaceAll('_', ' '),
                  (message[3])? message[3]: '',
                  ''
                ]
    return result
  }
  catch(e){
    sendText('2018101950', e)
  }
}