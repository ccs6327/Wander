Template.list.helpers({
	Items: function(){
		return Items.find({quantity: { $gt: 0}});
	},
	likes: function(){
		return Shops.findOne({_id: this.shopId})["likes"];
	},
	dislikes: function(){
		return Shops.findOne({_id: this.shopId})["dislikes"];
	}
});

Template.list.events({
	"click #addToCart": function(event) {
		Carts.insert({buyerId: Meteor.user()._id, itemId: this._id});

		var quantity = parseInt(Items.findOne({_id: this._id}).quantity)-1;
		Items.update({_id: this._id},{ $set: {quantity: quantity}});
	}
});