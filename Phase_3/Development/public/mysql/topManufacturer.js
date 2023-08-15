//connection:
const connection = require(__dirname + '/connection.js');

//top manufacturers:
async function getTopManufacturer() {

  const query = `SELECT m. manufacturer_name, COUNT(appliance_order) AS ApplianceCount
  FROM Manufacturer AS m, Appliance AS ap
  WHERE m.manufacturer_id = ap.manufacturer_id
  GROUP BY m.manufacturer_id
  ORDER BY ApplianceCount DESC
  LIMIT 25;
  `;

  return new Promise( function(resolve, reject){
    connection.query(query, function(err, results){
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

//appliance type count:
async function getApplianceData(manufacturerName){

  //queries:
  const query = `
  WITH tmp1 AS(
    SELECT ap.manufacturer_id,
    m.manufacturer_name,
    (CASE WHEN ac.email IS NOT NULL THEN 'Air_Conditioner'
    WHEN w.email IS NOT NULL THEN 'WaterHeater'
    WHEN ht.email IS NOT NULL THEN 'Heater'
    WHEN hp.email IS NOT NULL THEN 'HeatPump' end )AS appliance_type
    FROM Appliance AS ap
    INNER JOIN Manufacturer m ON ap.manufacturer_id = m.manufacturer_id
    LEFT JOIN AirConditioner AS ac ON ac.email = ap.email AND ac.appliance_order =
    ap.appliance_order
    LEFT JOIN WaterHeater AS w ON w.email = ap.email AND w.appliance_order =
    ap.appliance_order
    LEFT JOIN heater AS ht ON ht.email = ap.email AND ht.appliance_order =
    ap.appliance_order
    LEFT JOIN HeatPump AS hp ON hp.email = ap.email AND hp.appliance_order =
    ap.appliance_order
    WHERE m.manufacturer_name = ? ),
    tmp2 AS(
      SELECT manufacturer_id,manufacturer_name,
      (CASE WHEN appliance_type IN ('Air_Conditioner','Heater','HeatPump') THEN 'AirHandler'
      ELSE appliance_type END )AS appliance_type
      FROM tmp1
      WHERE appliance_type IN ('Air_Conditioner','Heater','HeatPump'))
      SELECT appliance_type, count(manufacturer_id) AS Appliance_Count
      FROM tmp1
      GROUP BY appliance_type
      UNION
      SELECT appliance_type, count(manufacturer_id) AS Appliance_Count
      FROM tmp2
      GROUP BY appliance_type;
      `;

      //return either error or result:
      return new Promise( function(resolve,reject){

        connection.query(query,[manufacturerName],function(err,results){
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
    getTopManufacturer,
    getApplianceData
  };
