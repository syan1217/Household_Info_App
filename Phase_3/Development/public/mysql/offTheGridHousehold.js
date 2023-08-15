const connection = require(__dirname + '/connection.js');

async function getStateWithTheMostOffTheGrid() {
    const query = 'SELECT ad.state, COUNT(h.email) AS household_count\n' +
        'FROM Household h\n' +
        'LEFT JOIN Address ad ON h.postal_code = ad.postal_code\n' +
        'WHERE email IN (SELECT email FROM HouseholdUtility WHERE utilities IS NULL)\n' +
        'GROUP BY ad.state\n' +
        'ORDER BY COUNT(h.email) DESC\n' +
        'LIMIT 1';

    //return either error or result:
    return new Promise(function (resolve, reject) {
            connection.query(query, function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        }
    );
}

async function getAverageBatteryStorageCapacity() {
    const query = 'SELECT COALESCE(ROUND(AVG(battery_storage_capacity)),\'\') AS avg_battery_storage_capacity\n' +
        'FROM    Generator g\n' +
        'WHERE    g.email IN (SELECT email FROM HouseholdUtility WHERE utilities IS NULL);\n';

    //return either error or result:
    return new Promise(function (resolve, reject) {
            connection.query(query, function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        }
    );
}

async function getPercentageOfPowerGenerationType() {
    const query = 'WITH GeneratorUser AS (\n' +
        'SELECT DISTINCT email, generation_type\n' +
        'FROM Generator\n' +
        ')\n' +
        'SELECT \'solar-electric\' AS power_generation_type,\n' +
        '    CONCAT(COALESCE(ROUND(100 * SUM(CASE WHEN generation_type = \'solar-electric\'\n' +
        '    AND email NOT IN (SELECT email FROM GeneratorUser WHERE generation_type = \'wind\') THEN 1 ELSE 0 END) / COUNT(DISTINCT email), 1),0), \'%\') AS percentage\n' +
        'FROM    GeneratorUser\n' +
        'WHERE    email IN (SELECT email FROM HouseholdUtility WHERE utilities IS NULL)\n' +
        'UNION\n' +
        'SELECT \'wind\' AS power_generation_type,\n' +
        '    CONCAT(COALESCE(ROUND(100 * SUM(CASE WHEN generation_type = \'wind\'\n' +
        '    AND email NOT IN (SELECT email FROM GeneratorUser WHERE generation_type = \'solar-electric\') THEN 1 ELSE 0 END) / COUNT( DISTINCT email), 1),0), \'%\') AS percentage\n' +
        'FROM    GeneratorUser\n' +
        'WHERE    email IN (SELECT email FROM HouseholdUtility WHERE utilities IS NULL)\n' +
        'UNION\n' +
        'SELECT \'wind+solar\' AS power_generation_type,\n' +
        '    CONCAT(COALESCE(ROUND(100 *(SUM(CASE WHEN generation_type = \'wind\'\n' +
        '   AND email IN (SELECT email FROM GeneratorUser WHERE generation_type = \'solar-electric\') THEN 1 ELSE 0 END) / COUNT( DISTINCT email)) , 1),0), \'%\') AS percentage\n' +
        'FROM    GeneratorUser\n' +
        'WHERE    email IN (SELECT email FROM HouseholdUtility WHERE utilities IS NULL);\n';

    //return either error or result:
    return new Promise(function (resolve, reject) {
            connection.query(query, function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        }
    );
}

async function getAverageCapacityWH() {
    const query = 'SELECT \'off_the_grid\' AS household_category, \n' +
        'COALESCE(ROUND(AVG(capacity),1),\'\') AS avg_wh_capacity\n' +
        'FROM WaterHeater w\n' +
        'WHERE email IN (SELECT email FROM HouseholdUtility WHERE utilities IS NULL)\n' +
        'UNION\n' +
        'SELECT \'on_the_grid\' AS household_category, \n' +
        'COALESCE(ROUND(AVG(capacity),1),\'\') AS avg_wh_capacity\n' +
        'FROM WaterHeater w\n' +
        'WHERE email IN (SELECT email FROM HouseholdUtility WHERE utilities IS NOT NULL);\n';

    //return either error or result:
    return new Promise(function (resolve, reject) {
            connection.query(query, function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        }
    );
}

async function getBTUsData() {
    const query = `
    select 'air_handler' AS appliance_type,COALESCE(min(ap.btu_rating),'') as min_btus,COALESCE(ROUND(avg(ap.btu_rating)),'') as avg_btus,COALESCE(max(ap.btu_rating),'') as max_btus
from Appliance ap
         left join AirConditioner ac on ap.email = ac.email and ap.appliance_order = ac.appliance_order
         left join Heater ht on ap.email = ht.email and ap.appliance_order = ht.appliance_order
         left join HeatPump hp on ap.email = hp.email and ap.appliance_order = hp.appliance_order
         left join HouseholdUtility hu on ap.email = hu.email
where (ac.email is not null or ht.email is not null or hp.email is not null)
  and hu.utilities is null
UNION
SELECT 'air_conditioner' AS appliance_type, COALESCE(MIN(btu_rating),'') AS  min_btus,COALESCE(ROUND(AVG(btu_rating)),'') AS avg_btus,COALESCE(MAX(btu_rating),'')  AS max_btus
FROM AirConditioner ac
         LEFT JOIN Appliance ap ON ac.email = ap.email AND ac.appliance_order =  ap.appliance_order
WHERE ac.email IN (SELECT email FROM HouseholdUtility WHERE utilities IS NULL) UNION
SELECT 'heater' AS appliance_type, COALESCE(MIN(btu_rating),'') AS
min_btus,COALESCE(ROUND(AVG(btu_rating)),'') AS avg_btus,COALESCE(MAX(btu_rating),'')  AS max_btus
FROM Heater ht
    LEFT JOIN Appliance ap ON ht.email = ap.email AND ht.appliance_order =  ap.appliance_order
WHERE ht.email IN (SELECT email FROM HouseholdUtility WHERE utilities IS NULL) UNION
SELECT 'heat_pump' AS appliance_type, COALESCE(MIN(btu_rating),'') AS  min_btus,COALESCE(ROUND(AVG(btu_rating)),'') AS avg_btus,COALESCE(MAX(btu_rating),'')  AS max_btus
FROM HeatPump hp
         LEFT JOIN Appliance ap ON hp.email = ap.email AND hp.appliance_order =  ap.appliance_order
WHERE hp.email IN (SELECT email FROM HouseholdUtility WHERE utilities IS NULL) UNION
SELECT 'water_heater' AS appliance_type, COALESCE(MIN(btu_rating),'') AS  min_btus,COALESCE(ROUND(AVG(btu_rating)),'') AS avg_btus,COALESCE(MAX(btu_rating),'')  AS max_btus
FROM WaterHeater w
         LEFT JOIN Appliance ap ON w.email = ap.email and w.appliance_order = ap.appliance_order WHERE w.email IN (SELECT email FROM HouseholdUtility WHERE utilities IS NULL);
    `;



    //return either error or result:
    return new Promise(function (resolve, reject) {
            connection.query(query, function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        }
    );
}

module.exports = {
    getStateWithTheMostOffTheGrid,
    getAverageBatteryStorageCapacity,
    getPercentageOfPowerGenerationType,
    getAverageCapacityWH,
    getBTUsData
};
