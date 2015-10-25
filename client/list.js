Template.list.helpers({
	Items: function(){
		return Items.find({quantity: { $gt: 0}});
	}
});

Template.list.events({
	"click #addToCart": function(event) {
		Carts.insert({buyerId: Meteor.user()._id, itemId: this._id});

		var title = Items.findOne({_id: this._id}).title;
		var price = Items.findOne({_id: this._id}).price;
		var image = Items.findOne({_id: this._id}).image;
		var description = Items.findOne({_id: this._id}).description;
		var quantity = parseInt(Items.findOne({_id: this._id}).quantity)-1;
		Items.update({_id: this._id},{
			title: title,
			price: price,
			image, image,
			description: description,
			quantity: quantity
		});

		Items.update(this._id,{$set: {status: "active"}});
	}
});