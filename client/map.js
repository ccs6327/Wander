Template.map.helpers({

});

mapOptions = function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
        // Map initialization options
        var currentLocation = Geolocation.latLng();
        if (currentLocation !== null) {
	        return {
	         	center: new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
	        	zoom: 5
	      	};
	    } else {
	    	console.log("cannot get location");
	      	//TODO pop up box
	    }
    }
},

Template.body.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  // GoogleMaps.ready('map', function(map) {
  //   // Add a marker to the map once it's ready
  //   var marker = new google.maps.Marker({
  //     position: new google.maps.LatLng(-36.8136, 142.9631),
  //     map: map.instance
  //   });
  //   var marker2 = new google.maps.Marker({
  //     position: new google.maps.LatLng(-37.8136, 143.9631),
  //     map: map.instance,
  //     icon: "https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png"
  //   });
  // });
});

Meteor.startup(function() {
  GoogleMaps.load();
});