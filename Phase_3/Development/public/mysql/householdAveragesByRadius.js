//connection:
const connection = require(__dirname + '/connection.js');

//function to apply view power generator queries:
async function getHouseholdInfoByRadius(postalCode,radius){

    //queries:
    const query = `   WITH Input AS (SELECT latitude AS lat, longitude AS lon
                                     FROM Address
                                     WHERE postal_code = ?),

                           AddressInput AS (SELECT ad.postal_code,
                                                   ad.latitude  AS lat1,
                                                   ad.longitude AS lon1,
                                                   i.lat        AS lat2,
                                                   i.lon        AS lon2
                                            FROM Address ad,
                                                 Input i),

                           Distance AS (SELECT ad.postal_code,
                                               ad.lat1,
                                               ad.lon1,
                                               ad.lat2,
                                               ad.lon2,
                                               2 * 3958.75 * ATAN2(SQRT(
                                                                               POWER(SIN((RADIANS(lat2) - RADIANS(lat1)) / 2), 2) +
                                                                               COS(RADIANS(lat1)) *
                                                                               COS(RADIANS(lat2)) *
                                                                               POWER(SIN((RADIANS(lon2) - RADIANS(lon1)) / 2), 2)),
                                                                   SQRT(1 -
                                                                        (POWER(SIN((RADIANS(lat2) - RADIANS(lat1)) / 2), 2) +
                                                                         COS(RADIANS(lat1)) *
                                                                         COS(RADIANS(lat2)) *
                                                                         POWER(SIN((RADIANS(lon2) - RADIANS(lon1)) / 2), 2)))
                                                   ) AS distance

                                        FROM AddressInput ad),

                           PostalCode AS (SELECT d.postal_code
                                          FROM Distance d
                                          WHERE d.distance <= ?),

                           AllHousehold AS (SELECT h.email,
                                                   h.postal_code,
                                                   h.square_footage,
                                                   h.household_type,
                                                   h.heating,
                                                   h.cooling
                                            FROM PostalCode pc
                                                     JOIN Household h ON pc.postal_code = h.postal_code),
                           AllHouseholdInfo AS (SELECT COUNT(DISTINCT a.email)                            AS households_count,
                                                       SUM(IF(LOWER(a.household_type) = 'house', 1, NULL))       AS house_count,
                                                       SUM(IF(LOWER(a.household_type) = 'apartment', 1, NULL))   AS apartment_count,
                                                       SUM(IF(LOWER(a.household_type) = 'townhome', 1, NULL))    AS townhome_count,
                                                       SUM(IF(LOWER(a.household_type)= 'condominium', 1, NULL)) AS condominium_count,
                                                       SUM(IF(LOWER(a.household_type) = 'mobile home', 1, NULL)) AS mobile_home_count,
                                                       ROUND(AVG(a.square_footage), 1)                    AS avg_square_footage,
                                                       ROUND(AVG(a.heating), 1)                           AS avg_heating_temp,
                                                       ROUND(AVG(a.cooling), 1)                           AS avg_cooling_temp
                                                FROM AllHousehold a),

                           UtilityInfo AS (SELECT GROUP_CONCAT(DISTINCT hu.utilities SEPARATOR ',') AS public_utilities_used,
                                                  SUM(IF(hu.utilities IS NULL and hu.email IS NOT NULL , 1, NULL))            AS off_the_grid_count
                                           FROM AllHousehold a
                                                    LEFT JOIN HouseholdUtility hu ON a.email = hu.email),

                           HouseholdWithGeneration AS (SELECT a.email,
                                                              g.generation_type,
                                                              g.battery_storage_capacity,
                                                              g.average_monthly_kilowatt_hours
                                                       FROM AllHousehold a
                                                                LEFT JOIN Generator g ON a.email = g.email
                                                       where g.email is not null),

                           GenerationInfo1 AS (SELECT COUNT(DISTINCT h.email)                      AS homes_with_power_generation_count,
                                                      ROUND(AVG(h.average_monthly_kilowatt_hours)) AS average_monthly_kilowatt_hours
                                               FROM HouseholdWithGeneration h),
                           GenerationInfo2 AS (SELECT COUNT(DISTINCT h.email) AS homes_with_battery_storage_count
                                               FROM HouseholdWithGeneration h
                                               WHERE h.battery_storage_capacity IS NOT NULL),
                           GenerationInfo3 AS (SELECT h.generation_type AS most_common_generation_method,
                                                      COUNT(h.email) as count
                      FROM HouseholdWithGeneration h
                      GROUP BY h.generation_type
                      ORDER BY count DESC
                          LIMIT 1)
    SELECT COALESCE(a.households_count, 0)                   AS households_count,
           COALESCE(a.house_count, 0)                        AS house_count,
           COALESCE(a.apartment_count, 0)                    AS apartment_count,
           COALESCE(a.townhome_count, 0)                     AS townhome_count,
           COALESCE(a.condominium_count, 0)                  AS condominium_count,
           COALESCE(a.mobile_home_count, 0)                  AS mobile_home_count,
           COALESCE(a.avg_square_footage, 0)                 AS avg_square_footage,
           COALESCE(a.avg_heating_temp, '')                   AS avg_heating_temp,
           COALESCE(a.avg_cooling_temp, '')                   AS avg_cooling_temp,
           COALESCE(u.public_utilities_used, '')             AS public_utilities_used,
           COALESCE(u.off_the_grid_count, 0)                 AS off_the_grid_count,
           COALESCE(g1.homes_with_power_generation_count, 0) AS homes_with_power_generation_count,
           COALESCE(g1.average_monthly_kilowatt_hours, 0)    AS average_monthly_kilowatt_hours,
           COALESCE(g2.homes_with_battery_storage_count, 0)  AS homes_with_battery_storage_count,
           COALESCE(g3.most_common_generation_method, '')    AS most_common_generation_method
    FROM AllHouseholdInfo a,
         UtilityInfo u,
         GenerationInfo1 g1,
         GenerationInfo2 g2,
         GenerationInfo3 g3
    `;

    //return either error or result:
    return new Promise( function(resolve,reject){

            connection.query(query,[postalCode,radius],function(err,results){
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
    getHouseholdInfoByRadius
};
