//queries for add powerGeneratorList pages:

//connection:
const connection = require(__dirname + '/connection.js');

//to create a function to apply view power generator queries:
async function getGeneratorData(Email){

  //queries:
  const query = `
  SELECT generator_order AS Num, generation_type AS Type,battery_storage_capacity AS
  BatterykWh,average_monthly_kilowatt_hours AS MonthlykWh
  FROM Generator
  WHERE email=?;

  `;

  //return either error or result:
  return new Promise( function(resolve,reject){

    connection.query(query,[Email],function(err,results){
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });

  }
);
}

//Delete from generator:
async function deleteGeneratorData(Email,GeneratorOrder){

  //queries:
  const query = `
  DELETE FROM Generator
  WHERE email= ? and generator_order= ?;
  `;

  //return either error or result:
  return new Promise( function(resolve,reject){

    connection.query(query,[Email,GeneratorOrder],function(err,results){
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });

  }
);
}

//export the function /property value:
module.exports = {
  getGeneratorData,
  deleteGeneratorData
};
