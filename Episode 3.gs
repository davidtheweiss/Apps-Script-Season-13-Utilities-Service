function doGet(e) {
  if (e.parameter['id'] != undefined) {
    return HtmlService.createTemplateFromFile('orderconfirmation').evaluate()
    .setTitle('Sporting Hut').setFaviconUrl('https://freepngimg.com/download/sports_activities/25360-5-sport-man.png');
  }
  return HtmlService.createTemplateFromFile('sportinghuthome').evaluate()
  .setTitle('Sporting Hut').setFaviconUrl('https://freepngimg.com/download/sports_activities/25360-5-sport-man.png');
}

function includeExternalFile(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getProducts() {
  let products = [];
  const sql = 'SELECT * FROM products';
  const conn = Jdbc.getCloudSqlConnection('jdbc:google:mysql://resonant-hawk-301416:us-central1:episode-13-3-database/sportinghut_main', 'root', 'appsscript');
  let statement = conn.createStatement();
  let query = statement.executeQuery(sql);
  while (query.next()) {
    products.push({
      'productID': query.getString(1),
      'name': query.getString(2),
      'price': query.getString(3),
      'color': query.getString(4),
      'size': query.getString(5),
      'photo_url': query.getString(6),
    });
  }
  statement.close();
  conn.close();
  return products;
}

function placeOrder(productID, email) {
  const date = new Date();
  const orderID = Utilities.getUuid();

  const sql = `INSERT INTO orders VALUES ('${orderID}', '${productID}', '${date.toString()}', ${null}, 'processing')`;
  const conn = Jdbc.getCloudSqlConnection('jdbc:google:mysql://resonant-hawk-301416:us-central1:episode-13-3-database/sportinghut_main', 'root', 'appsscript');
  let statement = conn.createStatement();
  statement.executeUpdate(sql);
  statement.close();
  conn.close();

  GmailApp.sendEmail(email, 'We\'ve revieved your order!', `Your order from SPORTING HUT is currently being processed. This may take some time before it's ready to ship. To track the status of your order please click the link below:\n\n${ScriptApp.getService().getUrl()}?id=${orderID}`);

  return orderID;
}

function getOrderDetails(orderID) {
  let products = [];
  const sql = `
    SELECT orders.orderPlacedDate, orders.status, products.name, products.price, products.color, products.size, products.photo_url 
    FROM products
    INNER JOIN orders ON orders.productID=products.productID
    AND orders.orderID='${orderID}';
  `;
  const conn = Jdbc.getCloudSqlConnection('jdbc:google:mysql://resonant-hawk-301416:us-central1:episode-13-3-database/sportinghut_main', 'root', 'appsscript');
  let statement = conn.createStatement();
  let query = statement.executeQuery(sql);
  while (query.next()) {
    products.push({
      'orderPlacedDate': Utilities.formatDate(new Date(query.getString(1)), 'EST', 'MMMM d, yyyy hh:mm a'),
      'status': query.getString(2),
      'name': query.getString(3),
      'price': query.getString(4),
      'color': query.getString(5),
      'size': query.getString(6),
      'photo_url': query.getString(7),
    });
  }
  console.log(products);
  statement.close();
  conn.close();
  return products;
}


function sleepExample() {
  while (true) {
     let weatherdata = UrlFetchApp.fetch('http://www.7timer.info/bin/astro.php?lon=37.7&lat=122.4&ac=0&unit=metric&output=json&tzshift=0');
    console.log(JSON.parse(weatherdata));
    console.log(new Date());
    Utilities.sleep(3000);
  }
}

