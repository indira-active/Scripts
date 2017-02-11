/* Send Spreadsheet in an email as CSV & save to Drive, automatically */
function emailSpreadsheetAsCSV() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("NAME");
  var lastRow = sheet.getLastRow();
  Logger.log(lastRow);
  var d = new Date();
  var currentTime = d.toLocaleDateString();
  Logger.log(currentTime)
  
  // Send the CSV of the spreadsheet to this email address
  var email = "recipient@domain.com"; 
  
  // Subject of email message
  var subject = currentTime + " Orders for Supplier"
 
  // Email Body can  be HTML too with your logo image - see ctrlq.org/html-mail
  var body = 'Dear Supplier, attached is a csv of our orders for the past day. ' +
             'Please fufill and update the column Tracking_Number for each order and return the spreadsheet to us. ' +
             'Additionally please let us know immediatley any items that are out of stock. ' +
             'Thank you.';
  
  // Base URL
  var url = "https://docs.google.com/spreadsheets/d/SS_ID/export?".replace("SS_ID", ss.getId());
  
  // Set config
  var url_ext = 'exportFormat=csv&format=csv'        // export as pdf / csv / xls / xlsx
  + '&size=letter'                       // paper size legal / letter / A4
  + '&portrait=false'                    // orientation, false for landscape
  + '&fitw=true&source=labnol'           // fit to page width, false for actual size
  + '&sheetnames=false&printtitle=false' // hide optional headers and footers
  + '&pagenumbers=false&gridlines=false' // hide page numbers and gridlines
  + '&fzr=false'                         // do not repeat row headers (frozen rows) on each page
  + '&gid=';                             // the sheet's Id
  
  // Auth
  var token = ScriptApp.getOAuthToken();
  
  // Fetch Spreadsheet
  var response = UrlFetchApp.fetch(url + url_ext + sheet.getSheetId(), {
    headers: {
      'Authorization': 'Bearer ' +  token
    }
  });
  
  // Format blob data to CSV
  var blob = response.getBlob().setName(sheet.getName() + ' - FO ' + currentTime + '.csv');
  
  // Save file to "Drive/Folder/Path"
  var dir = DriveApp.getFolderById("FOLDERID");
  var file = dir.createFile(blob);  

  // Send email with the CSV attachment
  if (MailApp.getRemainingDailyQuota() > 0)
    GmailApp.sendEmail(email, subject, body, {
      htmlBody: body,
      attachments:[blob],
      from: "sender@domain.com",
      name: "Company- Fulfilment",
      replyTo: "reply@domain.com",
      cc: "cc@domain.com"
    });

  // Cleanup Spreadsheet for processed orders
  if (lastRow >= 2) {
    // Purge rows that have been proccessed into blob
    sheet.deleteRows(2, lastRow);  
  }
}
