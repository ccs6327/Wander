Template.list.helpers({
	Items: function(){
		return Items.find({quantity: { $gt: 0}});
	},

	selectedClass: function() {
		if (this.status === 'active'){
			return 'selected';
		}else{
			return 'unselected';
		}
	}
});

Template.list.events({
	"click #addToCart": function(event) {
		Carts.insert({buyerId: Meteor.user()._id, itemId: this._id});

		var quantity = parseInt(Items.findOne({_id: this._id}).quantity)-1;
		Items.update({_id: this._id},{ $set: {quantity: quantity}});
	}
});