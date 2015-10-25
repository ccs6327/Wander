Template.myShop.helpers({
	Items: function(){
		var shop = Shops.findOne({owner: Meteor.userId()}); 
		var shopId = shop['_id'];
		return Items.find({shopId: shopId});
	},

	hasShop: function(){
		var shop = Shops.findOne({owner: Meteor.userId()});
		return typeof shop !== "undefined"
	},

	isShopSetup: function(){
		var shop = Shops.findOne({owner: Meteor.userId()}); 
		if (typeof shop['isActive'] !== "undefined") {
			return shop['isActive'];
		}
		return false
	}
});

Template.myShop.events({
	"click #setupShop": function(event) {
		event.preventDefault();
		var currentLocation = Geolocation.latLng();
		if (currentLocation !== null) {
			var currentLocationLat = currentLocation.lat;
			var currentLocationLng = currentLocation.lng;
			var shopId = Shops.findOne({owner: Meteor.userId()})['_id'];
			Shops.update({_id: shopId}, {$set: {isActive: true, shopLat: currentLocationLat, shopLng: currentLocationLng}});
		} else {
			//TODO cannot get location
		}
	},

	"click #tearDownShop": function(event) {
		event.preventDefault();
		var shopId = Shops.findOne({owner: Meteor.userId()})['_id'];
		Shops.update({_id: shopId}, {$set: {isActive: false}});
	},

	"click #removeIcon": function(event){
		Items.remove({_id: this._id});
	}
});