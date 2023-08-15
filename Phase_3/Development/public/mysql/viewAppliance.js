//queries for viewAppliance pages:

//connection:
const connection = require(__dirname + '/connection.js');

//to create a function to apply view appliance queries:
async function getApplianceData(Email){

  //queries:
  const query = `
  SELECT ap.appliance_order,
  (CASE WHEN w.appliance_order IS NOT NULL AND w.email IS NOT NULL THEN 'WaterHeater'
  WHEN (ac.appliance_order IS NOT NULL AND ac.email IS NOT NULL) OR
  (ht.appliance_order IS NOT NULL AND ht.email IS NOT NULL) OR
  (hp.appliance_order IS NOT NULL AND hp.email IS NOT NULL) THEN 'AirHandler'
  END) as Type,
  m.manufacturer_name,
  ap.model_name
  FROM Appliance ap
  LEFT JOIN Manufacturer m
  ON ap.manufacturer_id = m.manufacturer_id
  LEFT JOIN  WaterHeater w
  ON  ap.email=w.email AND ap.appliance_order = w.appliance_order
  LEFT JOIN  AirConditioner ac
  ON  ap.email=ac.email AND ap.appliance_order = ac.appliance_order
  LEFT JOIN  Heater ht
  ON ap.email=ht.email AND ap.appliance_order = ht.appliance_order
  LEFT JOIN  HeatPump hp
  ON  ap.email=hp.email AND ap.appliance_order = hp.appliance_order
  WHERE ap.email = ?;
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

//delete from waterheater:
async function deleteWaterHeater(ApplianceOrder, Email) {
  const query = `DELETE FROM WaterHeater WHERE appliance_order = ? AND email = ?;`;

  return new Promise( function(resolve, reject){
    connection.query(query, [ApplianceOrder, Email], function(err, results){
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

//delete from air conditioner:
async function deleteAirConditioner(ApplianceOrder, Email) {
  const query = `DELETE FROM AirConditioner WHERE appliance_order = ? AND email = ?;`;

  return new Promise( function(resolve, reject){
    connection.query(query, [ApplianceOrder, Email], function(err, results){
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

//delete from Heater:
async function deleteHeater(ApplianceOrder, Email) {
  const query = `DELETE FROM Heater WHERE appliance_order = ? AND email = ?;`;

  return new Promise( function(resolve, reject){
    connection.query(query, [ApplianceOrder, Email], function(err, results){
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

//delete from heat pump:
async function deleteHeatPump(ApplianceOrder, Email) {
  const query = `DELETE FROM HeatPump WHERE appliance_order = ? AND email = ?;`;

  return new Promise( function(resolve, reject){
    connection.query(query, [ApplianceOrder, Email], function(err, results){
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

//delete from Apppliance:
async function deleteAppliance(ApplianceOrder, Email) {
  const query = `DELETE FROM Appliance WHERE appliance_order = ? AND email = ?;`;

  return new Promise( function(resolve, reject){
    connection.query(query, [ApplianceOrder, Email], function(err, results){
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
  getApplianceData,
  deleteAppliance,
  deleteWaterHeater,
  deleteAirConditioner,
  deleteHeater,
  deleteHeatPump,
};
