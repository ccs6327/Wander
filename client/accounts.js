Template.accounts.helpers({
	boughtItems:function(){
		var transactions = Transactions.find({buyerId: Meteor.userId()}).fetch();
		var array = [];
		for (x in transactions){
			var history = {};
			history.price = transactions[x]["price"];
			var itemId = transactions[x]["itemId"];
			var item = Items.findOne({_id: itemId});
			history.title = item["title"];
			history.seller = Shops.findOne({_id: item["shopId"]})["name"];
			array.push(history);
		}
		console.log(array);
		return array;
	},
	soldItems:function(){
		var transactions = Transactions.find({sellerId: Meteor.userId()}).fetch();
		var array = [];
		for (x in transactions){
			var history = {};
			history.price = transactions[x]["price"];
			var itemId = transactions[x]["itemId"];
			var item = Items.findOne({_id: itemId});
			history.title = item["title"];
			history.seller = Shops.findOne({_id: item["shopId"]})["name"];
			array.push(history);
		}
		console.log(array);
		return array;
	}
});