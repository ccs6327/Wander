Template.list.helpers({
	Items: function(){
		var activeShopsId = [];
		var activeShops = Shops.find({isActive: true, owner: {$not: Meteor.userId()}}).fetch();

		for (x in activeShops) {
			var shopId = activeShops[x]["_id"];
			activeShopsId.push(shopId);
		}
		return Items.find({quantity: { $gt: 0}, shopId: { $in: activeShopsId }});
	},
	likes: function(){
		return Shops.findOne({_id: this.shopId})["likes"];
	},
	dislikes: function(){
		return Shops.findOne({_id: this.shopId})["dislikes"];
	},
	seller: function(){
		var owner = Shops.findOne({_id: this.shopId})["owner"];
		var email = Meteor.users.findOne({_id: owner}).emails[0].address;
		return email;
	}
});

Template.registerHelper('getImage', function (sessionId) {
	console.log(sessionId);
	var image = Images.findOne({sessionId: sessionId});
	console.log(image);
	if (typeof image !== "undefined") {
		return image;
	} else {
		var image = {};
		image.url = "images/wanderLogo.png";
		return image;
	}
});

Template.list.events({
	"click #addToCart": function(event) {
		Carts.insert({buyerId: Meteor.user()._id, itemId: this._id});

		var quantity = parseInt(Items.findOne({_id: this._id}).quantity)-1;
		Items.update({_id: this._id},{ $set: {quantity: quantity}});

		Router.go('/checkout');
	}
});