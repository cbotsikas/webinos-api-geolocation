/*******************************************************************************
*  Code contributed to the webinos project
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* Copyright 2012 BMW AG
* Copyright 2011 Alexander Futasz, Fraunhofer FOKUS
*******************************************************************************/

// implemenation using geoip
(function() {
	
// rpcHandler set be setRPCHandler
var rpcHandler = null;

// store running timer objects in this table under given key from caller
var watchIdTable = {};

// var used for debugging only;
var counter = 0;


var recordedData = require("./playbackData.js");
var cIndex = 0;
var playbackTimer = null;
exports.restartPlayBack = function(){
    console.log("%%%%%%%%%%% Restarting geolocation playback :)");
    if (playbackTimer) clearTimeout(playbackTimer);
    cIndex = 0;
    playbackTimer = setTimeout(playBackData,recordedData[cIndex+1].offset);
};
function playBackData(){
    if (cIndex < recordedData.length - 2){
        cIndex++;
        playbackTimer = setTimeout(playBackData,recordedData[cIndex+1].offset);
    }else { // Play the last packet
        cIndex = 0; // and start over
        playbackTimer = setTimeout(playBackData,1000);
//        console.log("_______GPS Restart");
    }
//    console.log("_______GPS Index:"+cIndex+"/"+(recordedData.length-1));
};
playbackTimer = setTimeout(playBackData,10000+recordedData[cIndex+1].offset);
//console.log("_______GPS Index:"+cIndex+"/"+(recordedData.length-1));


/**
 * Retrieve the current position.
 * @param params Optional options object for enabling higher accuracy.
 * @param successCB Success callback.
 * @param errorCB Error callback.
 */
function getCurrentPosition (params, successCB, errorCB){
    var coords = {};
    coords.accuracy = 1000;
    if (params && params.enableHighAccuracy) {
        coords.accuracy = 1;
    }
    coords.latitude = recordedData[cIndex].lat;
    coords.longitude = recordedData[cIndex].lon;
    coords.accuracy = recordedData[cIndex].accuracy;
    coords.altitude = recordedData[cIndex].elevation;
    coords.altitudeAccuracy = recordedData[cIndex].accuracy;
    coords.heading = recordedData[cIndex].bearing;
    coords.speed = recordedData[cIndex].speed;
    var position = {};
    position.coords=coords;
    position.timestamp = (new Date()).getTime();
    successCB(position);
}

/**
 * Continuously call back with the current position.
 * @param args Array, first item being the options object, second item being an id.
 * @param successCB Success callback.
 * @param errorCB Error callback.
 * @param objectRef RPC object reference.
 */
function watchPosition (args, successCB, errorCB, objectRef) {
    var tint = 2000;
	var params = args[0];
	if (params && params.maximumAge) tint = params.maximumAge;
	
	function getPos() {
		// call getCurrentPosition and pass back the position
		getCurrentPosition(params, function(e) {
			var rpc = rpcHandler.createRPC(objectRef, 'onEvent', e);
			rpcHandler.executeRPC(rpc);
		}, errorCB);
	}
	
	// initial position
	getPos();

	var watchId = setInterval(function() {getPos(); }, tint);
	
	watchIdTable[objectRef.rpcId] = watchId;
}

/**
 * Clear continuously position event for given listener id.
 * @param params Array, first item being the listener id.
 */
function clearWatch (params, successCB, errorCB) {
	var watchIdKey = params[0];
	var watchId = watchIdTable[watchIdKey];
	delete watchIdTable[watchIdKey];

	clearInterval(watchId);
}

/**
 * Set the RPC handler
 * @private
 */
function setRPCHandler(rpcHdlr) {
	rpcHandler = rpcHdlr;
}

function setRequired() {
	// no needed
}

exports.getCurrentPosition = getCurrentPosition;
exports.watchPosition = watchPosition;
exports.clearWatch = clearWatch;
exports.setRPCHandler = setRPCHandler;
exports.setRequired = setRequired;
exports.serviceDesc = {
		api:'http://webinos.org/api/w3c/geolocation',
		displayName:'Geolocation (by playback)',
		description:'Provides geolocation based on ip address.'
};

})(module.exports);
