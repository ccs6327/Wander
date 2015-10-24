Template.addItem.helpers({

});

Template.addItem.events({
	"submit .new-item": function(event){
		event.preventDefault();

		var title = event.target.title.value;
		var price = event.target.price.value;
		var quantity = event.target.price.value;
		var description = event.target.description.value;
		var shop = Shops.findOne({userId: Meteor.userId()});

		console.log(title);
		console.log(price);
		console.log(quantity);
		console.log(description);

		if (typeof shop === "undefined"){
			console.log('create shop');
			Shops.insert({
				owner: Meteor.userId(),
				likes: 0,
				dislikes: 0
			}, function (err, id) {
				console.log(err);

				Items.insert({
					shopId: id, 
					title: title,
					description: description,
					price: price,
					quantity: quantity
				}, function (err, id) {
					console.log(err);
					Router.go('/myShop');
				});
			});
		} else {
			shopId = shop['_id'];
			Items.insert({
				shopId : shopId,
				title: title,
				description: description,
				price: price,
				quantity: quantity
			}, function (err, id) {
				console.log(err);
				Router.go('/myShop');
			});
		}
	}
});

Template.addItem.rendered = function(){

};