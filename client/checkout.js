Template.checkout.helpers({
	Carts: function(){
		return Carts.find();
	}
});

Template.checkout.events({
	"click #removeFromCart": function(event) {
		var title = Items.findOne({_id: this.itemId}).title;
		var price = Items.findOne({_id: this.itemId}).price;
		var image = Items.findOne({_id: this.itemId}).image;
		var description = Items.findOne({_id: this.itemId}).description;
		var quantity = parseInt(Items.findOne({_id: this.itemId}).quantity)+1;
		Items.update({_id: this.itemId},{
			title: title,
			price: price,
			image, image,
			description: description,
			quantity: quantity
		});

		Carts.remove({_id: this._id});
	},

	"click #checkOutCart": function(event){
		//TODO: 
		//TODO: remove all items from buyerId's cart
	}
});