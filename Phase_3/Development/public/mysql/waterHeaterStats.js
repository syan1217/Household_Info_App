//connection:
const connection = require(__dirname + '/connection.js');

//top manufacturers:
async function getWaterHeaterStats() {

    const query = `SELECT ad.state, COALESCE(ROUND(AVG(w.capacity)),0) AS avg_wh_capacity,COALESCE(ROUND(AVG(ap.btu_rating)),0) AS avg_wh_btus,COALESCE(ROUND(AVG(w.temperature_setting)),'') AS avg_wh_temp,COALESCE(COUNT(IF(w.temperature_setting IS NOT NULL, 1, NULL)), 0) AS count_with_temp_setting,COALESCE(COUNT(IF(w.temperature_setting IS NULL and w.appliance_order is not null, 1, NULL)), 0) AS count_without_temp_setting
                   FROM Address ad
                   LEFT JOIN Household h ON ad.postal_code = h.postal_code
                   LEFT JOIN Appliance ap ON h.email = ap.email
                   LEFT JOIN WaterHeater w ON ap.email = w.email AND ap.appliance_order = w.appliance_order
                   where w.email is not null
                   GROUP BY ad.state
                   ORDER BY ad.state ASC;`;

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
async function getEnergySourceData(stateName){

    //queries:
    const query = `SELECT
                       w.energy_source_wh AS energy_source,
                       COALESCE(ROUND(MIN( w.capacity)),'') AS min_state_wh_capacity,
                       COALESCE(ROUND(AVG(w.capacity)),'') AS avg_state_wh_capacity,
                       COALESCE(ROUND(MAX( w.capacity)),'') AS max_state_wh_capacity,
                       COALESCE(ROUND(MIN( w.temperature_setting),1),'') AS min_state_wh_temp,
                       COALESCE(ROUND(AVG(w.temperature_setting),1),'') AS avg_state_wh_temp,
                       COALESCE(ROUND(MAX( w.temperature_setting),1),'') AS max_statewh_temp
                   FROM Address ad
                   LEFT JOIN Household h ON ad. postal_code = h. postal_code
                   LEFT JOIN Appliance ap ON h.email = ap.email
                   LEFT JOIN WaterHeater w ON ap.email = w.email AND ap. appliance_order = w. appliance_order
                   WHERE ad.state = ?
                   GROUP BY w.energy_source_wh
                   ORDER BY w.energy_source_wh ASC;`;

    //return either error or result:
    return new Promise( function(resolve,reject){

            connection.query(query,[stateName],function(err,results){
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
    getWaterHeaterStats,
    getEnergySourceData
};