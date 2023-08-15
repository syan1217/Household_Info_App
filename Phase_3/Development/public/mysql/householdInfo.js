//queries on householdInfo page:
const connection = require(__dirname + '/connection.js');
//Insert into household table:
const insertHousehold = `INSERT INTO Household (email, postal_code, square_footage, household_type, heating, cooling) VALUES (?, ?, ?, ?, ?, ?)`;

//Insert into publicUtilities table:
const insertHouseholdUtility = `INSERT INTO HouseholdUtility (email, utilities) VALUES (?, ?)`;

// Validate email input against duplicate emails in MySQL database

async function checkEmailExists(Email) {

    //query:
    const query = 'SELECT COUNT (email) AS email_count FROM Household WHERE email = ?';

    //return either error or result:
    return new Promise(function (resolve, reject) {
            connection.query(query, [Email], function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0].email_count);
                }
            });
        }
    );
}

async function checkPostalExists(postalCode) {

    //query:
    const query = 'SELECT COUNT(postal_code) AS postal_count FROM Address WHERE postal_code = ?';

    //return either error or result:
    return new Promise(function (resolve, reject) {
            connection.query(query, [postalCode], function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0].postal_count);
                }
            });
        }
    );
}

//export the queries:
module.exports = {
  insertHousehold,
  insertHouseholdUtility,
  checkEmailExists,
  checkPostalExists
};