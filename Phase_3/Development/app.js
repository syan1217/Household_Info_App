// use express module:
const express = require("express");
//use ejs module:
const ejs = require("ejs");

//use body-parser module to pass the parameter from UI side to server side.
const bodyParser = require("body-parser");

//create an instance to allow us to use functionality of express framework.
const app = express();

//create express-session
const session = require('express-session');
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

//mysql related:
//connection:
const connection = require(__dirname + '/public/mysql/connection.js');
//connection promise:
const {initPromiseConnection}  = require(__dirname + '/public/mysql/initPromiseConnection.js');

//householdInfo page queries:
const householdInfoQueries = require(__dirname + '/public/mysql/householdInfo.js');
const addApplianceQueries = require(__dirname + '/public/mysql/addAppliance.js');
//vewAppliance page queries:
const viewApplianceQueries = require(__dirname + '/public/mysql/viewAppliance.js');
//powerGeneratorList page queries:
const powerGeneratorListQueries = require(__dirname + '/public/mysql/powerGeneratorList.js');
//addPowerGenerator page queries:
const addPowerGeneratorQueries = require(__dirname + '/public/mysql/addPowerGenerator.js');
//top manufacturer:
const topManufacturerQueries = require(__dirname + '/public/mysql/topManufacturer.js');
//off-the-grid household dashboard
const offTheGridHouseholdQueries = require(__dirname + '/public/mysql/offTheGridHousehold.js');
//heatingCooling method details page queries:
const heatingCoolingQueries = require(__dirname + '/public/mysql/heatingCooling.js');
//waterHeaterStats:
const waterHeaterStatsQueries = require(__dirname + '/public/mysql/waterHeaterStats.js');
//household average by radius:
const householdInfoByRadiusQueries = require(__dirname + '/public/mysql/householdAveragesByRadius.js');
//manufacturer model search page queries:
const manufacturerModelQueries = require(__dirname + '/public/mysql/manufacturerModel.js');
//import ejs with creating a views folder, and we will place all UI related files in this 'views' folder.
app.set('view engine', 'ejs');

//set up a static folder, we can name it as 'public'. We can put any static files like css or images here.
app.use(express.static("public"));

//to extract data from client side in UI to server side in certain format,usually combine with req.body.
app.use(bodyParser.urlencoded({extended:true}));

//give a response back to the client when a client log into your URL path created from your server:
//it kinda like display sth.
// the first parameter means route.
//req means request, res means response.
app.get("/",function(req,res){
  let content = 'BOOM!!'
  // res.render is a method in the Express.js web framework that renders an EJS template and sends the resulting HTML markup to the client.
  res.render("mainMenu",{Content:content});
})

//for householdInfo:
app.get("/householdInfo",async function(req,res){
  res.render("householdInfo", {errors: null});
})

//for add appliance:
app.get("/addAppliance",function(req,res){
  // query manufacturer information, include id and name
  connection.query(addApplianceQueries.readManufacturer, function(err, manufacturers) {
        if (err) {
            console.error(err);
            return;
        }
        req.session.manufacturer = manufacturers;
        res.render("addAppliance",{manufacturers:manufacturers, errors:null});
    })
})

//for view appliance:
// app.get("/viewAppliance",async function(req,res){
//   const Email = req.session.email;
//
//   //try catch is a mechanism in handling error and program can continue to run.
//   //just think that you got some returned result from a function you defined, it could also be error, right?
//   //if it is error it will go to the other direction.
//   try {
//     //since it takes time to finish query, so we need to add await here.
//     const result = await viewApplianceQueries.getApplianceData(Email);
//     res.render('viewAppliance', { appliances: result });
//   } catch (error) {
//     console.error('Error fetching appliance data:', error);
//   }
//
// })

app.get("/viewAppliance", async function(req, res) {
  const Email = req.session.email;

  try {
    const result = await viewApplianceQueries.getApplianceData(Email);
    let disableNextButton = result.length === 0 && req.session.deleteAppliance;
    res.render('viewAppliance', { appliances: result, disableNextButton: disableNextButton });
    //const showNextButton = req.session.showNextButton || !disableNextButton;
    //res.render('viewAppliance', { appliances: result, showNextButton: showNextButton });
  } catch (error) {
    console.error('Error fetching appliance data:', error);
  }
});


//for add addPowerGeneration:
app.get("/addPowerGenerator",async function(req,res){

    const Email = req.session.email;
    //try catch is a mechanism in handling error and program can continue to run.
    //just think that you got some returned result from a function you defined, it could also be error, right?
    //if it is error it will go to the other direction.
    try {
        //since it takes time to finish query, so we need to add await here.
        const result = await addPowerGeneratorQueries.isOffTheGrid(Email);
        req.session.isOffTheGrid = result;
        res.render('addPowerGenerator',{ offTheGrid:result, errors:null });
    } catch (error) {
        console.error('Error fetching generator data:', error);
    }
})

//for view power generator list:
app.get("/powerGeneratorList",async function(req,res){

  const Email = req.session.email;

  //try catch is a mechanism in handling error and program can continue to run.
  //just think that you got some returned result from a function you defined, it could also be error, right?
  //if it is error it will go to the other direction.
  try {
    //since it takes time to finish query, so we need to add await here.
    const result = await powerGeneratorListQueries.getGeneratorData(Email);
    //disable finish button or not:
    const disableFinishButton = result.length === 0 && req.session.isOffTheGrid;
    res.render('powerGeneratorList', { generators: result, disableFinishButton: disableFinishButton });
    //res.render('powerGeneratorList', { generators: result, disableFinishButton:disableFinishButton });
  } catch (error) {
    console.error('Error fetching generator data:', error);
  }
})

//wrapping up:
app.get("/wrappingUp",function(req,res){
    req.session.destroy()
    res.render("wrappingUp");
})

//view report or query data:
app.get("/viewReports",function(req,res){
    res.render("viewReports");
})

// app.get("/topManufacturer",async function(req,res){
//   try {
//     //since it takes time to finish query, so we need to add await here.
//     const result1 = await topManufacturerQueries.getTopManufacturer();
//     const result2 = await topManufacturerQueries.getApplianceData('LG');
//     res.render("topManufacturer",{ topManufacturers: result1, Appliances: result2 });
//   } catch (error) {
//     console.error('Error fetching generator data:', error);
//   }
//
// })

app.get("/topManufacturer", async function (req, res) {

  try {
    //get the result for top manufactuers table:
    const topManufacturers = await topManufacturerQueries.getTopManufacturer();
    //map() takes each element from the original array as an argument, processes it, and returns a new value.
    //The new values are then collected to form the new array.
    const appliancesPromises = topManufacturers.map(

      async function(manufacturer){
      //appliance type with count table:
      const applianceData = await topManufacturerQueries.getApplianceData(manufacturer.manufacturer_name);
      return {
        //manufactuer name:
        manufacturer_name: manufacturer.manufacturer_name,
        //appliance data table:
        appliances: applianceData
      };

    });
    //returned result is promised result, and promise is a pending operation and may not come out result yet. So we have to await
    //it come out the result and then assign to an variable.
    const appliances = await Promise.all(appliancesPromises);

    res.render("topManufacturer", { topManufacturers, appliances });
  } catch (error) {
    console.error('Error fetching generator data:', error);
  }

});


app.get("/manufacturerModel",function(req,res){
    res.render("manufacturerModel",{results: null});
})

app.get("/heatingCooling",async function(req,res){
    try{
        const heatingCooling = await heatingCoolingQueries.getheatingCooling();
        res.render("heatingCooling", {heatingCooling});
    } catch (error) {
        console.error('Error fetching heating/cooling method details:', error);
    }
});

app.get("/waterheaterStatistics", async function (req, res) {
    try {
        const waterHeaterStats = await waterHeaterStatsQueries.getWaterHeaterStats();
        const energySourcePromises = waterHeaterStats.map(async function(stats){
            const energySourceData = await waterHeaterStatsQueries.getEnergySourceData(stats.state);
            return {
                state_name: stats.state,
                energySource: energySourceData
            };
        });

        const energySource = await Promise.all(energySourcePromises);
        res.render("waterheaterStatistics", {waterHeaterStats,energySource});
    } catch (error) {
        console.error('Error fetching water heater statistics:', error);
    }
});

app.get("/offTheGridHousehold",async function (req, res) {
    try {
        const stateWithTheMostOffTheGrid = await offTheGridHouseholdQueries.getStateWithTheMostOffTheGrid();
        const averageBatteryStorageCapacity = await offTheGridHouseholdQueries.getAverageBatteryStorageCapacity();
        const percentageOfPowerGenerationType = await offTheGridHouseholdQueries.getPercentageOfPowerGenerationType();
        const averageCapacityWH = await offTheGridHouseholdQueries.getAverageCapacityWH();
        const BTUsData = await offTheGridHouseholdQueries.getBTUsData();

        res.render("offTheGridHousehold", {stateWithTheMostOffTheGrid, averageBatteryStorageCapacity,
            percentageOfPowerGenerationType,averageCapacityWH,BTUsData});
    } catch (error) {
        console.error('Error fetching generator data:', error);
    }
})

app.get("/householdAveragesByRadius",function(req,res){
    res.render("householdAveragesByRadius",{errors:null,results:null});
})

// //give a response back to the client when a client input sth from UI you have created:
app.post("/householdInfo",async function(req,res){

//pass the input from UI to the backend:
    const formData = req.body;

    async function validateHouseholdInfo(formData) {
        const errorsInfo = {};

        // validate email, if null or exist in the database then error

        if (!formData.Email) {
            errorsInfo.Email = "Please enter an email!";
        }

        if (!formData.postalCode) {
            errorsInfo.postalCode = "Please enter a postal code!";
        }

        let emailExistsPromise = householdInfoQueries.checkEmailExists(formData.Email);
        // ...
        let postalExistsPromise = householdInfoQueries.checkPostalExists(formData.postalCode);

        let emailExists = await emailExistsPromise;
        if (emailExists) {
            errorsInfo.Email = "Email already exists, please enter a new one!"
        }

        let postalExists = await postalExistsPromise;
        if (!postalExists) {
            errorsInfo.postalCode = "Postal code is invalid!";
        }

        // validate householdType, if null then error
        if (!formData.householdType ) {
            errorsInfo.householdType = "Please select a house type!";
        }

        // validate squareFootage, if null or not a whole number, then error
        if (!formData.squareFootage || !Number.isInteger(Number(formData.squareFootage))) {

            errorsInfo.squareFootage = "Please enter a whole number of square footage!";
        }

        // validate heating, if don't select No Heating button, when heating value is null or not a number, then error
        // if select No Heating button and enter a heating value at the same time, then error
        // formData.heatingCheck

        const isCoolingChecked = req.body.coolingCheck === "on";
        const isHeatingChecked = req.body.heatingCheck === "on";
        if (!isHeatingChecked) {
            if (!formData.heating) {
                errorsInfo.heating = "Please enter heating setting or select No Heating button!";
            } else if (!Number.isInteger(Number(formData.heating))) {
                errorsInfo.heating = "Please enter a whole number of heating setting!";
            }
        } else {
            if (formData.heating) {
                errorsInfo.heating = "Please don't enter heating setting and select No Heating button at the same time!";
            }
        }
        // validate cooling, if don't select No Cooling button, when cooling value is null or not a number, then error
        // if select No Cooling button and enter a cooling value at the same time, then error
        if (!isCoolingChecked) {
            if (!formData.cooling) {
                errorsInfo.cooling = "Please enter cooling setting or select No Cooling button!";
            } else if (!Number.isInteger(Number(formData.cooling))) {
                errorsInfo.cooling = "Please enter a whole number of cooling setting!";
            }
        } else {
            if (formData.cooling) {
                errorsInfo.cooling = "Please don't enter cooling setting and select No Cooling button at the same time!";
            }
        }
        return errorsInfo;
    }

    const errorsInfo1 = await validateHouseholdInfo(formData);

    //if no errors, then insert data into Household table
    if (Object.keys(errorsInfo1).length === 0) {
        const email = formData.Email;
        const postalCode = formData.postalCode;
        const squareFootage = Number(formData.squareFootage);
        const householdType = formData.householdType;
        const heating = Number(formData.heating) || null;
        const cooling = Number(formData.cooling) || null;
        const publicUtilities = formData.publicUtilities;

    connection.query(householdInfoQueries.insertHousehold,
      [email, postalCode, squareFootage, householdType, heating, cooling], function(err, result){
    if (err) throw err;
    //update publicUtilities table:
    //case 1: no public utility is selected:
    if (publicUtilities === null) {
        connection.query(householdInfoQueries.insertHouseholdUtility, [email, null], function(err, result){
            if (err) throw err;
        });
        //case 2: one more public utility is selected:
    } else if (Array.isArray(publicUtilities)) {
        //forEach method has only one argument because it's a synchronous operation. It only contains one argument, we should follow the way it is!
        publicUtilities.forEach( function(utility) {
            connection.query(householdInfoQueries.insertHouseholdUtility, [email, utility], function(err, result){
                if (err) throw err;
            });
        });
        //only one selected:
    } else {
        connection.query(householdInfoQueries.insertHouseholdUtility, [email, publicUtilities], function(err, result){
            if (err) throw err;
        });
    }
  });
  // store email to sessionStorage
  req.session.email = email;
  //route to next page:
  res.redirect('/addAppliance');
    } else {
        res.render('householdInfo', {errors:errorsInfo1});
    }
})

app.post("/addAppliance",async function(req,res) {
    //pass the input from UI to the backend
    const formDataAppliance = req.body;
    const email = req.session.email;
    const applianceType = formDataAppliance.applianceType;
    const skip = req.body.skipAppliance;

    //When the skip button is pressed, set a new session variable called showFinishButton to true:
    if (skip) {
        res.redirect('/viewAppliance');
        return;
    }

    function validateApplianceInfo(formDataAppliance) {
        const errorsInfoAppliance = {};

        // validate BTU Rating, if null or not a whole number, then error
        let a =Number.isInteger(Number(formDataAppliance.btuRating));
        if (!formDataAppliance.btuRating || !Number.isInteger(Number(formDataAppliance.btuRating))) {
            errorsInfoAppliance.btuRating = "Please enter a whole number of BTU Rating!";
        }
        if (formDataAppliance.manufacturer==="") {
            errorsInfoAppliance.manufacturer = "Please select a manufacturer!";
        }

        // validate water heater
        if (formDataAppliance.applianceType === 'waterHeater') {
            // validate energy source for water heater, if null, then error
            if (!formDataAppliance.energySourceWH ) {
                errorsInfoAppliance.energySourceWH = "Please select an energy source for Water Heater!";
            }
            // validate capacity for water heater, if null or not a number, then error
            if (!formDataAppliance.capacityWH || isNaN(formDataAppliance.capacityWH)) {
                errorsInfoAppliance.capacityWH = "Please enter a number of capacity for Water Heater!";
            }
            // validate temperature for water heater, if null or not a whole number, then error
            if (formDataAppliance.temperatureSettingWH && !Number.isInteger(Number(formDataAppliance.temperatureSettingWH))) {
                errorsInfoAppliance.temperatureSettingWH = "Please enter a whole number of temperature setting for Water Heater!";
            }
        }
        if (formDataAppliance.applianceType === 'airHandler') {
            // validate eer for airhandler, if null or not a number, then error
            if (formDataAppliance.airConditioner === 'on') {
                if (!formDataAppliance.eer || isNaN(formDataAppliance.eer)) {
                    errorsInfoAppliance.eer = "Please enter a number of EER for Air Conditioner!";
                }
            }
            if (formDataAppliance.heater === 'on') {
                if (!formDataAppliance.energySourceH) {
                    // validate energy source for heater, if null, then error
                    errorsInfoAppliance.energySourceH = "Please select an Energy Source for Heater!";
                }
            }
            if (formDataAppliance.heatPump === 'on') {
                // validate seer for Heat Pump, if null or not a number, then error
                if (!formDataAppliance.seer|| isNaN(formDataAppliance.seer)) {
                    errorsInfoAppliance.seer = "Please enter a number of SEER for Heat Pump!";
                }
                // validate hspf for Heat Pump, if null or not a number, then error
                if (!formDataAppliance.hspf || isNaN(formDataAppliance.hspf)) {
                    errorsInfoAppliance.hspf = "Please enter a number of HSPF for Heat Pump!";
                }
            }
            if (!formDataAppliance.airConditioner && !formDataAppliance.heater && !formDataAppliance.heatPump){
                errorsInfoAppliance.coolingMethod = "Please select a cooling method!";
            }
        }

        return errorsInfoAppliance;
    }

    if (applianceType) {
        const formDataAppliance = req.body;
        const errorsInfoAppliance = validateApplianceInfo(formDataAppliance);
        const manufacturers = req.session.manufacturer;
        const manufacturerName = req.body.manufacturer;
        let manufacturerId;

        if (Object.keys(errorsInfoAppliance).length === 0) {
            // find the manufacturer_id through selected manufacturerName
            let foundManufacturer = manufacturers.find(m => m.manufacturer_name === manufacturerName);
            if (foundManufacturer) {
                manufacturerId = foundManufacturer.manufacturer_id;
            } else {
                // can't find manufacturerId,return
            }

            function toTheTenth(string) {
                let result = Number(Number(string).toFixed(1));
                return result;
            }
            // if applianceOrder already exists, then use applianceOrder, otherwise, init to 1;
            let applianceOrder = parseInt(req.session.applianceOrder) || 1;
            const btuRating = Number(formDataAppliance.btuRating);
            const modelName = formDataAppliance.modelName;

            // Initialize promiseConnection
            const promiseConnection = await initPromiseConnection();

            // Update Appliance table
            await promiseConnection.query(addApplianceQueries.insertAppliance, [
                email,
                applianceOrder,
                manufacturerId,
                modelName,
                btuRating,
            ]);

            // Update waterHeater table if waterHeater is selected
            if (applianceType === 'waterHeater') {
                const energySourceWH = formDataAppliance.energySourceWH;
                const capacityWH = toTheTenth(formDataAppliance.capacityWH);
                const temperatureSettingWH = Number(formDataAppliance.temperatureSettingWH);
                await promiseConnection.query(addApplianceQueries.insertWaterheater, [
                    email,
                    applianceOrder,
                    capacityWH,
                    temperatureSettingWH,
                    energySourceWH,
                ]);
            }
            // Update Airconditioner, Heater, or HeatPump table if airHandler is selected
            else (applianceType === 'airHandler')
            {
                const airConditionerChecked = req.body.airConditioner === 'on';
                const heaterChecked = req.body.heater === 'on';
                const heatPumpChecked = req.body.heatPump === 'on';

                if (airConditionerChecked) {
                    const eer = toTheTenth(formDataAppliance.eer);
                    await promiseConnection.query(addApplianceQueries.insertAirconditioner, [
                        email,
                        applianceOrder,
                        eer,
                    ]);
                }
                if (heaterChecked) {
                    const energySourceH = formDataAppliance.energySourceH;
                    await promiseConnection.query(addApplianceQueries.insertHeater, [
                        email,
                        applianceOrder,
                        energySourceH,
                    ]);
                }
                if (heatPumpChecked) {
                    const seer = toTheTenth(formDataAppliance.seer);
                    const hspf = toTheTenth(formDataAppliance.hspf);
                    await promiseConnection.query(addApplianceQueries.insertHeatPump, [
                        email,
                        applianceOrder,
                        hspf,
                        seer,
                    ]);
                }
            }
            // store new applianceOrder to sessionStorage
            req.session.applianceOrder = applianceOrder + 1;

            //route to next page:
            res.redirect('/viewAppliance');
        } else {
            res.render("addAppliance",{manufacturers, errors: errorsInfoAppliance});
        }
    }
    else{
        res.redirect('/viewAppliance');
    }
})

//delete appliance:
app.post("/deleteAppliance",async function(req,res){

    const Email = req.session.email;
    const ApplianceOrder = req.body.applianceOrder;
    req.session.deleteAppliance = true;

    try {
        await viewApplianceQueries.deleteWaterHeater(ApplianceOrder, Email);
        await viewApplianceQueries.deleteAirConditioner(ApplianceOrder, Email);
        await viewApplianceQueries.deleteHeater(ApplianceOrder, Email);
        await viewApplianceQueries.deleteHeatPump(ApplianceOrder, Email);
        await viewApplianceQueries.deleteAppliance(ApplianceOrder, Email);
        //route to view appliance page:
        res.redirect('/viewAppliance');
    } catch (error) {
        console.error('Error in Deleteing:', error);
    }

})

//add power generator:
app.post("/addPowerGenerator",function(req,res){
    const formDatapowerGenerator = req.body;
    const email = req.session.email;
    const generatorType = req.body.generatorType;

    function validatepowerGenerator (formDatapowerGenerator) {
        const errorspowerGenerator ={};

        //validate battery storage capacity is not whole number, then error
        if (formDatapowerGenerator.storageKwh && !Number.isInteger(Number(formDatapowerGenerator.storageKwh))) {
            errorspowerGenerator.storageKwh = "Please enter a whole number of battery storage capacity!"
        }

        //validate average monthly kilowatt hours, if null or not whole number, then error
        if (!(Number.isInteger(Number(formDatapowerGenerator.monthlyKwh)) && formDatapowerGenerator.monthlyKwh)) {
            errorspowerGenerator.monthlyKwh = "Please enter a whole number of monthly kilowatt hours!"
        }
        return errorspowerGenerator;
    }

    // if generatorOrder already exists, then use generatorOrder, otherwise, init to 1;
    let generatorOrder = parseInt(req.session.generatorOrder) || 1;

    //pass the data from UI to backend

    const skip = req.body.skipButton

    //When the skip button is pressed, set a new session variable called showFinishButton to true:
    req.session.showFinishButton = false;
    if (skip) {
      req.session.showFinishButton = true;
      res.redirect('/powerGeneratorList');
      return;
    }

    if (generatorType) {
        if (skip) {
            res.redirect('/powerGeneratorList');
            return;
        } else {
            const formDatapowerGenerator = req.body;
            const errorspowerGenerator = validatepowerGenerator(formDatapowerGenerator);
            if (Object.keys(errorspowerGenerator).length === 0) {
                // if generatorOrder already exists, then use generatorOrder, otherwise, init to 1;
                let generatorOrder = parseInt(req.session.generatorOrder) || 1;
                const monthlyKwh = formDatapowerGenerator.monthlyKwh   !== undefined ?Number(formDatapowerGenerator.monthlyKwh) :null ;
                const storageKwh = Number(formDatapowerGenerator.storageKwh);


                connection.query(addPowerGeneratorQueries.insertGenerator,
                    [email, generatorOrder, generatorType, monthlyKwh, storageKwh], function (err, result) {
                        if (err) throw err;
                    });

                req.session.generatorOrder = generatorOrder + 1;
                //route to next page:
                res.redirect('/powerGeneratorList');
                return;}

            else {
                res.render("addPowerGenerator", {offTheGrid: req.session.isOffTheGrid, errors: errorspowerGenerator});
            }}

    }
    else {
        res.redirect('/powerGeneratorList');
        return;
    }
})

//powerGeneratorList:
app.post("/powerGeneratorList",function(req,res){
  console.log(req.body);
  //route to next page:
  res.redirect('/wrappingUp');
})

//delete generator:
app.post("/deleteGenerator",async function(req,res){

  const Email = req.session.email;
  const GeneratorOrder = req.body.generatorOrder;
  req.session.deleteGenerator = true;

  try {
    await powerGeneratorListQueries.deleteGeneratorData(Email,GeneratorOrder);
    //route to view appliance page:
    res.redirect('/powerGeneratorList');
  } catch (error) {
    console.error('Error in Deleting:', error);
  }
})

//manufactuer model search post method:
app.post("/manufacturerModel",async function(req,res){
    try {
        const searchstring = req.body.searchString;
        const manufacturerModelData = await manufacturerModelQueries.getmanufacturerModel(searchstring,searchstring);
        res.render("manufacturerModel", {results: manufacturerModelData,searchstring:searchstring});
    } catch (error) {
        console.error('Error fetching manufacturer model search:', error);
    }
});

//delete generator:
app.post("/householdAveragesByRadius",async function(req,res){

    const formData = req.body;
    async function validateHouseholdAveragesByRadiusInfo(formData) {
        // validate postalCode, if null or not exist in the database then error
        const errorsInfo = {};
        if (!formData.postalCode) {
            errorsInfo.postalCode = "Please enter a postal code!";
        }

        let postalExistsPromise = householdInfoQueries.checkPostalExists(formData.postalCode);
        let postalExists = await postalExistsPromise;
        if (!postalExists) {
            errorsInfo.postalCode = "Postal code is invalid!";
        }

        if (!formData.radius) {
            errorsInfo.radius = "Please select a radius!";
        }
        return errorsInfo;
    }
    const errorsInfo = await validateHouseholdAveragesByRadiusInfo(formData);
    if(Object.keys(errorsInfo).length === 0){
        try {
            const householdInfoByRadius = await householdInfoByRadiusQueries.getHouseholdInfoByRadius(formData.postalCode,formData.radius);
            res.render('householdAveragesByRadius',{postalCode:formData.postalCode,radius:formData.radius, errors:null,results:householdInfoByRadius});
        } catch (error) {
            console.error('Error in Deleting:');
        }
    }
    else {
        res.render('householdAveragesByRadius', {errors:errorsInfo,results:null});
    }

})



//start the server and assign a port or heroku:
app.listen(process.env.PORT || 3040, function(){
    console.log("Server started on port 3040")
});
