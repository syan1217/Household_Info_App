//disable or enable input box based on checkbox for heating:
/*function disableHeating() {
  document.getElementById("heating").disabled = document.getElementById("heatingCheck").checked;
}*/

function disableHeating() {
    const heatingInput = document.getElementById("heating");
    if (document.getElementById("heatingCheck").checked) {
        heatingInput.disabled = true;
        heatingInput.value = "";
    } else {
        heatingInput.disabled = false;
    }
  }

//disable or enable input box based on checkbox for cooling:
/*function disableCooling() {
  document.getElementById("cooling").disabled = document.getElementById("coolingCheck").checked;
}*/
function disableCooling() {
    const coolingInput = document.getElementById("cooling");
    if (document.getElementById("coolingCheck").checked) {
        coolingInput.disabled = true;
        coolingInput.value = "";
    } else {
        coolingInput.disabled = false;
    }
  }

//add appliance:
function updateAttributes() {
  const applianceType = document.getElementById("applianceType").value;

  document.getElementById("waterHeaterAttributes").style.display =
    applianceType === "waterHeater" ? "block" : "none";
  document.getElementById("airHandlerAttributes").style.display =
    applianceType === "airHandler" ? "block" : "none";

  updateAirHandlerAttributes();
}

function updateAirHandlerAttributes() {
  const airConditionerChecked = document.getElementById("airConditioner").checked;
  const heaterChecked = document.getElementById("heater").checked;
  const heatPumpChecked = document.getElementById("heatPump").checked;

  document.getElementById("airConditionerAttributes").style.display =
    airConditionerChecked ? "block" : "none";
  document.getElementById("heaterAttributes").style.display =
    heaterChecked ? "block" : "none";
  document.getElementById("heatPumpAttributes").style.display =
    heatPumpChecked ? "block" : "none";
}

function showDetails2(manufacturerName) {
    // Hide all tables
    const tables = document.getElementsByClassName('detailsTableContainer');
    for (let i = 0; i < tables.length; i++) {
      tables[i].style.display = 'none';
    }

    // Show the table for the selected manufacturer
    const detailsTableContainer = document.getElementById(`detailsTableContainer-${manufacturerName}`);
    detailsTableContainer.style.display = 'block';
}

function showDetails(stateName) {
    // Hide all tables
    const tables = document.getElementsByClassName('detailsTableContainer');
    for (let i = 0; i < tables.length; i++) {
        tables[i].style.display = 'none';
    }

    // Show the table for the selected manufacturer
    const detailsTableContainer = document.getElementById(`detailsTableContainer-${stateName}`);
    detailsTableContainer.style.display = 'block';
}
