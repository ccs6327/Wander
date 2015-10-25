Template.shop.helpers({
	Items: function(){
		var shopId = this._id;
		return Items.find({quantity: {$gt: 0}}, {shopId: shopId}); 
	}
});