Template.map.helpers({
	mapOptions: function() {
	    // Make sure the maps API has loaded
	    if (GoogleMaps.loaded()) {
	        // Map initialization options
	        var currentLocation = Session.get("geo");

	        var lat = currentLocation.lat;
	        var lng = currentLocation.lng;
	        return {
	        	center: new google.maps.LatLng(lat, lng),
	        	zoom: 15
	        };
	    }
	}
});



Template.body.onCreated(function() {
	// We can use the `ready` callback to interact with the map API once the map is ready.
	GoogleMaps.ready('map', function(map) {
		// Add a marker to the map once it's ready
		var currentLocation = Session.get("geo");

		var lat = currentLocation.lat;
		var lng = currentLocation.lng;
		var marker = new google.maps.Marker({
		    position: new google.maps.LatLng(lat, lng),
		    map: map.instance
		});
		
		var shops = Shops.find({isActive: true}).fetch();
		for (x in shops) {
			var shop = shops[x];

			// if (shop["owner"] == Meteor.userId()) {
			// 	continue;
			// }

			var shopLat = shop["shopLat"];
			var shopLng = shop["shopLng"];

			var radiantLat1 = Math.PI * lat / 180;
			var radiantLat2 = Math.PI * shopLat / 180;
			var radiantLng1 = Math.PI * lng / 180;
			var radiantLng2 = Math.PI * shopLng / 180;
			var theta = lng - shopLng;
			var radiantTheta = Math.PI * theta / 180;
			var distance = Math.sin(radiantLat1) * Math.sin(radiantLat2) + Math.cos(radiantLat1) * Math.cos(radiantLat2) * Math.cos(radiantTheta);
			distance = Math.acos(distance);
			distance = distance * 180 / Math.PI;
			distance = distance * 60 * 1.1515;
			distance = distance * 0.8684; // convert to mile

			var image = "http://localhost:3000/images/shopping-cart.png";
			if (distance <= 1) {
				var userEmail = Meteor.users.findOne({_id: shop["owner"]}).emails[0].address;
				console.log(userEmail);
				var contentString = "<h5>" + userEmail + "</h5>" +
					"<li><image src='/images/thumbsup.png'></image>" + shop["likes"] +
					"<image src='/images/thumbsdown.png'></image>" + shop["dislikes"] + "</li>" +
					"<a class='btn btn-primary' href='/shop/" + shop["_id"] + "'>Go to shop</a><br>";

				var infowindowWidth = $(window).width() * 0.8;
				var infowindowHeight = $(window).height() * 0.8;
				var infowindow = new google.maps.InfoWindow({
					content: contentString,
					maxWidth: 500
				});
				var newMarker = new google.maps.Marker({
					position: new google.maps.LatLng(shopLat, shopLng),
					map: map.instance,
					icon: image
				});
				newMarker.addListener("click", function(){
					infowindow.open(map.instance, newMarker)
				});
			}
		}
	});
});

Meteor.startup(function() {
    Tracker.autorun(function () {
	    var geo = Geolocation.latLng();
	    Session.set('geo', geo);
	}); 
    GoogleMaps.load();
});