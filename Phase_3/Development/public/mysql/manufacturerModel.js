//connection:

const connection = require(__dirname + '/connection.js');

//manufacturerModel search:
async function getmanufacturerModel(searchstring1, searchstring2) {
  const query = `
    SELECT DISTINCT m.manufacturer_name, ap.model_name
    FROM Appliance ap
           LEFT JOIN Manufacturer m ON ap.manufacturer_id = m.manufacturer_id
    WHERE LOWER(m.manufacturer_name) LIKE LOWER(?)
       OR LOWER(ap.model_name) LIKE LOWER(?)
    ORDER BY m.manufacturer_name ASC,ap.model_name ASC;
  `;

  return new Promise(function (resolve, reject) {
    connection.query(query, ['%' + searchstring1 + '%', '%' + searchstring2 + '%'], function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}



    //export the function /property value:
    module.exports = {
      getmanufacturerModel
    };
