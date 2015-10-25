Template.cart.helpers({
	Items: function(){
		var buyerCarts = Carts.find({buyerId: Meteor.userId()}).fetch();
		var items = [];
		for (x in buyerCarts) {
			var itemId = buyerCarts[x]['itemId'];
			var item = Items.findOne({_id: itemId});
			item["cartId"] = buyerCarts[x]['_id'];
			items.push(item);
		}
		return items;
	},
	hasItem: function() {
		return typeof Carts.findOne({buyerId: Meteor.userId()}) !== "undefined"; 
	}
});

Template.cart.events({
	"click #removeFromCart": function(event) {
		var quantity = parseInt(Items.findOne({_id: this._id}).quantity)+1;

		Items.update({_id: this._id}, {$set: {quantity: quantity}});
		Carts.remove({_id: this.cartId});
	},
});