/**
 * Generates the body for the Shopify Pages request
 * @param {String} productTitle The unique name of the product
 * @param {String} sizeChart The HTML for the page
 * @returns {Object} body Properties and content of the page
 */
function generateBody(productTitle, sizeChart) {
  var body = {
    page: {
      author: 'Product Uploader Script',
      body_html: sizeChart,
      title: productTitle.toUpperCase() + ' Size Chart',
      published: false,
      handle: productTitle.toLowerCase() + '-size-chart'
    }
  }
  return body;
};
  

/**
 * Calls Shopify and creates a new page.
 * @param {Object} body Properties and content of the page
 */
function createPage(body) {
  var endpoint = 'https://<SHOPIFY_DOMAIN>.myshopify.com/admin/pages.json'
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode('SHOPIFY_TOKEN' + ':' + '<SHOPIFY_SECRET')
  };
  var params = {
    'method': 'post',
    'payload': JSON.stringify(body),
    'contentType': 'application/json',
    'headers': headers
  };
  
  var response = UrlFetchApp.fetch(endpoint, params);
  Logger.log(response.getResponseCode());
  Logger.log(response.getContentText()); 
  Logger.log(response);
}
