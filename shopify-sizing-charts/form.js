/**
 * Responds to a form submission via onFormSubmit trigger.
 * Might want to migrate from parsing formResponses to parsing the spreadshreet Row.
 * @param {Object} e The event parameter created by a form submission
 */
function onSubmit(e) {
  // Parse response
  var productTitle, productSizes, productMeasurements, submitType;
  Logger.log(e.response);
  itemResponses = e.response.getItemResponses();
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    Logger.log('Response to the question "%s" of type "%s" and id "%s" was "%s"',
               itemResponse.getItem().getTitle(),
               itemResponse.getItem().getType(),
               itemResponse.getItem().getId(),
               itemResponse.getResponse());
    // Exit if sizing chart not submitted
    if (itemResponse.getItem().getId() == '1.224249031E9' && itemResponse.getItem().getType() == 'MULTIPLE_CHOICE') {
      submitType = itemResponse.getResponse();
      if (submitType == 'Submit new variant (for each variant)') {
         Logger.log("Exiting.... Sizing chart not submitted");
         return;
      }
    }
    // Store key responses
    if (itemResponse.getItem().getId() == '1.724452893E9' && itemResponse.getItem().getType() == 'CHECKBOX') {
      productSizes = itemResponse.getResponse();
      productSizes.unshift('SIZE');
      Logger.log(productSizes);
    } 
    else if (itemResponse.getItem().getId() == '8.25727728E8' && itemResponse.getItem().getType() == 'CHECKBOX') {
      productMeasurements = itemResponse.getResponse();
      Logger.log(productMeasurements);
    }
    else if (itemResponse.getItem().getId() == '1.972309686E9' && itemResponse.getItem().getType() == 'TEXT') {
      productTitle = itemResponse.getResponse();
      Logger.log(productTitle);
    } 
    else {
      continue;
    }
  }
  
  // Exit if sizing chart not submitted
  if (productSizes  === undefined || productMeasurements === undefined || productSizes === null || productMeasurements === null || productSizes.length == 0 || productMeasurements.length == 0) {
    Logger.log("Exiting.... Sizing chart not submitted");
    return
  }
  
  // Generate table code
  sizingChart = buildTable(productSizes, productMeasurements);
  Logger.log(sizingChart);
  
  // Send to Shopify to Create Sizing Chart Page
  request = generateBody(productTitle, sizingChart);
  createPage(request);

  /* Future improvements
  * Send to Sheets API
  * - Append to supplier product listing 
  * - Append to arden product listings
  * Send product to Shopify
  * - Populate properties as per SOP
  * - Format images
  * Sizing chart
  * - Standarize / input cells
  */
}


/**
 * Generates an HTML table from input column and row headers.
 * @param {Array} colHeaders Sizing headers for specific chart
 * @param {Array} rowHeaders Measurement headers for specific chart
 * @returns {String} output Concatonated string of HTML
 */
function buildTable(colHeaders, rowHeaders) {
  var pre = "<div class='tg-wrap'><table class='tg'><tbody>", post = "</tbody></table></div>";
  var numCols = colHeaders.length, numRows = rowHeaders.length + 1;
  var output = ""
  output += pre;
  // Table rows
  for (i = 1; i <= numRows; i++) {
    output += "<tr>"; // Start Row
    // Table columns
    for (j = 1; j <= numCols; j++) {
      // Header Row
      if (i === 1) {
        output += "<th class='tg-v1lu'>" + colHeaders[j - 1] + "</th>"; // Add column headers
      }
      // Other Rows
      else {
        if (j === 1) {
          rowHeaders[i - 2] = firstLetterUp(rowHeaders[i - 2]); // Format capitalization
          output += "<td class='tg-5py8'>" + rowHeaders[i - 2] + "</td>"; // Add row headers 
        } else {
          output += "<td class='tg-tski'>" + "" + "</td>"; // Add blank space for measurement columns
        }
      }
    }
    output += "</tr>"; // Finish Row
  }
  output += post;
  Logger.log(output);
  return output;
}


/**
 * Makes the first letter of a string uppercase.
 * @param {String} string The event parameter created by a form submission
 * @returns {String} The modified string
 */
function firstLetterUp(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

function test() {
  buildTable(['Size', 'Test', 'Test2'], ['waist', 'LENGTH', 'LeNgth', 'hWight']);
}