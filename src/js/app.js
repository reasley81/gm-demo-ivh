// Your code goes here
const vin = gm.info.getVIN();
const host = "http://gmcdh.pegatsdemo.com";
const streamPort = "7003"
vinStr = JSON.stringify(vin);
var nbaElem = document.getElementById('nba');
var ttsID = "";
let data = "";
let eventdata = "";
let url = "";
var nbaHTML;

gm.comm.getNetworkConnectivity(networkManager)

ttsID = gm.voice.startTTS(success, 'Please keep your eyes on the road');
gm.voice.stopTTS(ttsID);

function networkManager(connected) {
  if(connected) {
    url = host + '/prweb/PRRestService/PegaMKTContainer/V2/Container';
    data = {"CustomerID":"2","ContainerName":"InVehicle","Channel":"Web","Direction":"Inbound","Resource":"AllResults","Contexts":[{"Type":"VehicleVin","Key":"VIN","Value":vin}]};
    //console.log('Request body: ' + JSON.stringify(data));
        
    fetch(url, {
        method: 'post',
        headers: {
        "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(json)
    .then(function (data) {
      //console.log('Request succeeded with JSON response', data);
      nbaHTML = "<h2>Next Best Actions</h2><div id=\"nbacontent\"><table>";
      
      //If no NBAs are returned, display a default message
      if(data.ContainerList[0].NextBestActions.length <= 0)
      {
          nbaHTML = nbaHTML + "<tr><td>No Next Best Actions to display at this time.</td></tr>";
      }
      else {
        //In 8.4, the NBA's are separated by Business Issue/Group. We must loop over everything to get them all
        for (var i=0; i < data.ContainerList[0].NextBestActions.length; i++) { //Loop over all NBAs
            for (var j=0; j < data.ContainerList[0].NextBestActions[i].RankedResults.length; j++) { //Loop over each issue and group
              nbaHTML = nbaHTML + "<tr><td><b>" + data.ContainerList[0].NextBestActions[i].RankedResults[j].Label + "</b></td></tr>" +
                "<tr><td>" +data.ContainerList[0].NextBestActions[i].RankedResults[j].Benefits + "</td></tr>" + 
                "<tr><td></td></tr><tr><td></td></tr>";
            }
        }
      }
      nbaHTML + "</table></div>";
      nbaElem.innerHTML = nbaHTML;
    })
    .catch(function (error) {
        console.log('Request failed', error);
    });
  }
}

function json(response) {
    return response.json()
}

function success(){
  //do some stuff
}

function callCustomerService() {
  //alert("calling customer service");
  var id = gm.voice.startTTS(success, "Please keep your eyes on the road");
  gm.voice.stopTTS(id);
  gm.ui.showAlert({
    alertTitle: 'Make Call',
    alertDetail: 'Call GM Customer Service?',
    primaryButtonText: 'Ok',
    primaryAction: function calling() {},
    secondaryButtonText: 'Cancel',
    secondaryAction: function cancelCall() {}
  })
}

function oilInd(data) {
  var oilIndValue = data.change_oil_ind;
  //alert(oilInd);
  sendEvent('change_oil_ind',oilIndValue)
}

function batteryChargeState(data) {
  var bcs = data.battery_charge_state;
  sendEvent('battery_charge_state',bcs);
}

gm.info.watchVehicleData(oilInd, ['change_oil_ind']);
//gm.info.getVehicleData(oilInd, ['change_oil_ind']);

gm.info.watchVehicleData(batteryChargeState, ['battery_charge_state']);
//gm.info.getVehicleData(batteryChargeState, ['battery_charge_state']);

function sendEvent(type, value) {
  var eventID = generateEventID();
  value = value + ''; //for some reason, we need to convert the value to a string
  //url = host + ":" + streamPort + "/stream/VehicleEvent";
  url = "http://gmcdh.pegatsdemo.com:7003/stream/EventStream";
  //console.log(request);
  eventdata = {"VIN":vin,"Type":type,"Value":value,"EventID":eventID};
  //console.log(eventdata);
      
  fetch(url, {
      method: 'post',
      headers: {
      "Content-type": "application/json"
      },
      body: JSON.stringify(eventdata)
  })
  .then(json)
  .then(function (eventdata) {
      console.log('Request succeeded with JSON response', eventdata);
    
  })
  .catch(function (error) {
      console.log('Request failed', error);
      ttsID = gm.voice.startTTS(success, "Problem sending event to Pega");
      gm.voice.stopTTS(ttsID);
  });
}

function generateEventID() {
  var today = new Date();
  //today.getFullYear()+''+(today.getMonth()+1)+''+today.getDate()+''+today.getHours()+''+today.getMinutes()+''+today.getSeconds()+''+today.getMilliseconds();
  return today.getUTCFullYear()+''+(today.getUTCMonth()+1)+''+today.getUTCDate()+''+
  today.getUTCHours()+''+today.getUTCMinutes()+''+today.getUTCSeconds()+''+today.getUTCMilliseconds();
}

/*
Sample code below, for reference

var vinElem = document.getElementById('vin');
gm.info.getVehicleConfiguration(function(data) {
  vinElem.innerHTML = gm.info.getVIN();
});

function showSpeed(data) {
  console.log(data);
  var speed = data.average_speed;
  if (speed !== undefined) {
    var speedText = document.getElementById('speed');
    speedText.innerHTML = speed;
  }
}
*/