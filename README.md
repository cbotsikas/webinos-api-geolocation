# webinos geolocation API #

**Service Type**: http://webinos.org/api/w3c/geolocation

The geolocation API is based on W3C geolocation.


## Installation ##

To install the geolocation API you will need to npm the node module inside the webinos pzp.

For end users, you can simply open a command prompt in the root of your webinos-pzp and do: 

	npm install https://github.com/webinos/webinos-api-geolocation.git

For developers that want to tweak the API, you should fork this repository and clone your fork inside the node_module of your pzp.

	cd node_modules
	git clone https://github.com/<your GitHub account>/webinos-api-geolocation.git
	cd webinos-api-geolocation
	npm install


## Getting a reference to the service ##

To discover the service you will have to search for the "http://webinos.org/api/w3c/geolocation" type. Example:

	var serviceType = "http://webinos.org/api/w3c/geolocation";
	webinos.discovery.findServices( new ServiceType(serviceType), 
		{ 
			onFound: serviceFoundFn, 
			onError: handleErrorFn
		}
	);
	function serviceFoundFn(service){
		// Do something with the service
	};
	function handleErrorFn(error){
		// Notify user
		console.log(error.message);
	}

Alternatively you can use the webinos dashboard to allow the user choose the geolocation API to use. Example:
 	
	webinos.dashboard.open({
         module:'explorer',
	     data:{
         	service:[
            	'http://webinos.org/api/w3c/geolocation'
         	],
            select:"services"
         }
     }).onAction(function successFn(data){
		  if (data.result.length > 0){
			// User selected some services
		  }
	 });

## Methods ##

Once you have a reference to an instance of a service you can use the following methods:

###getCurrentPosition(positionCB, positionErrorCB, positionOptions)

getCurrentPosition method retrieves the current position
- The param positionCB is called with the current position in case of success
- The param positionErrorCB an Error callback.
- positionOptions is an optional object to configure the behaviour of getCurrentPosition.

###watchPosition(positionCB, positionErrorCB, positionOptions)

watchPosition method registers a listener for position updates. 
- The param positionCB Callbacks for position updates.
- The param positionErrorCB an Error callback.
- The param positionOptions an Optional options.

###clearWatch(watchId)

clearWatch method clears a listener registered with watch Position
- The watchId parameter as returned by


## Links ##

- [Specifications](http://webinos.org/api/w3c/geolocation)
- [Examples](https://github.com/webinos/webinos-api-geolocation/wiki/Examples)
