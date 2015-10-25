Template.shop.helpers({
	Items: function(){
		var shopId = this._id;
		return Items.find({quantity: {$gt: 0}}, {shopId: shopId}); 
	},
	likes: function(){
		var shopId = this._id;
		return Shops.findOne({_id: this._id})["likes"];
	},
	dislikes: function(){
		var shopId = this._id;
		return Shops.findOne({_id: this._id})["dislikes"];
	},
	sellerEmail: function(){
		var shopId = this._id;
		owner = Shops.findOne({_id: this._id})["owner"];
		return Meteor.users.findOne({_id: owner}).emails[0].address;
	}
});

Template.shop.events({
	"click #addToCart": function(event) {
		Carts.insert({buyerId: Meteor.user()._id, itemId: this._id});

		var quantity = parseInt(Items.findOne({_id: this._id}).quantity)-1;
		Items.update({_id: this._id},{ $set: {quantity: quantity}});

		Router.go('/checkout');
	}
});