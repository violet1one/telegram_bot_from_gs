var token = "";
var url = "https://api.telegram.org/bot" + token;
var webAppUrl = "https://script.google.com/macros/s//exec";
var ssId = "";

function getMe() {
  var response = UrlFetchApp.fetch(url + "/getMe");
  Logger.log(response.getContentText());
}

function getUpdates() {
  var response = UrlFetchApp.fetch(url + "/getUpdates");
  Logger.log(response.getContentText());
}

function setWebhook() {
  var response = UrlFetchApp.fetch(url + "/setWebhook?url=" + webAppUrl);
  Logger.log(response.getContentText());
}

function sendText(id, text) {
  var response = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + id + "&text=" + encodeURIComponent(text));
  Logger.log(response.getContentText());
}


function doGet(e) {
  return HtmlService.createHtmlOutput("Hello " + JSON.stringify(e));
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var text = contents.message.text;
    var id = contents.message.from.id;
    var name = contents.message.from.first_name + " " + contents.message.from.last_name;
    sendText(id, "[Кто/Проблема/Время/Решение/Доп]");
  
    var ss = SpreadsheetApp.openById(ssId);
    var arrText = text.split("/");
    ss.appendRow([new Date(),name,arrText[0],arrText[1],arrText[2],arrText[3],arrText[4]]);
  
    if(/^@/.test(text)) {
      var sheetName = text.slice(1).split(" ")[0];
      var newText = text.split(" ").slice(1).join(" ");
      var sheet = ss.getSheetByName(sheetName) ? ss.getSheetByName(sheetName) : ss.insertSheet(sheetName);
      var arrText = newText.split("/");
      sheet.appendRow([new Date(),name,arrText[0],arrText[1],arrText[2],arrText[3],arrText[4]]);
      sendText(id,"Записано в лист " + sheetName);
  }
 } catch(e) {
    sendText(wimId,JSON.stringify(e,null,4));
 }
}
