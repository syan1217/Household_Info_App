//queries for add Power Generator pages:

//connection:
const connection = require(__dirname + '/connection.js');

//to create a function to check if it is off-the grid queries:
async function isOffTheGrid(Email){

  //queries:
  const query = `
  SELECT COUNT(email) AS cnt_ongrid FROM HouseholdUtility
  WHERE utilities IS NULL and email = ?;
  `;

  //return either error or result:
  return new Promise( function(resolve,reject){

    connection.query(query,[Email],function(err,results){
      if (err) {
        reject(err);
      } else {
        resolve(results[0].cnt_ongrid);
      }
    });

  }
);
}


const insertGenerator = `INSERT INTO Generator (email, generator_order, generation_type, battery_storage_capacity, average_monthly_kilowatt_hours) VALUES (?, ?, ?, ?, ?)`;

//export the function /property value:
module.exports = {
  isOffTheGrid,insertGenerator
};
