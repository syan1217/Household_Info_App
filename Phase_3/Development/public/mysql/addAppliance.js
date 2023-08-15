//queries on addAppliance page:

const readManufacturer = 'SELECT manufacturer_id, manufacturer_name FROM manufacturer';
const insertAppliance = `INSERT INTO Appliance (email, appliance_order, manufacturer_id, model_name,
                       btu_rating) VALUES (?, ?, ?, ?, ?)`;
const insertWaterheater = `INSERT INTO Waterheater (email, appliance_order, capacity,temperature_setting,
                         energy_source_wh) VALUES (?, ?, ?, ?, ?)`;
const insertHeater = `INSERT INTO Heater (email, appliance_order, energy_source_h) VALUES (?, ?, ?)`;
const insertAirconditioner = `INSERT INTO Airconditioner (email, appliance_order, eer) VALUES (?, ?, ?)`;
const insertHeatPump = `INSERT INTO HeatPump (email, appliance_order, hspf, seer) VALUES (?, ?, ?, ?)`;

//export the queries:
module.exports = {readManufacturer, insertAppliance, insertWaterheater, insertAirconditioner, insertHeater, insertHeatPump};
