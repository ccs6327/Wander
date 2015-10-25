var CURRENTFILE = "";

Template.addItem.helpers({
	imageName: function(){
		console.log(Session.get("CURRENTFILE"));
		console.log(Images.findOne({name: "Screen Shot 2015-10-02 at 10.27.53 am.png"}));
		return Images.findOne({name: "Screen Shot 2015-10-02 at 10.27.53 am.png"});
		// return Images.find({});
	}
});

Template.addItem.events({
	"submit .new-item": function(event){
		event.preventDefault();

		var title = event.target.title.value;
		var price = parseInt(event.target.price.value);
		var quantity = parseInt(event.target.quantity.value);
		var description = event.target.description.value;
		var shop = Shops.findOne({owner: Meteor.userId()});

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

Template.dropzone.events({
  'dropped #dropzone': function(e) {
      FS.Utility.eachFile(e, function(file) {
        var newFile = new FS.File(file);
        CURRENTFILE = newFile["data"]["blob"]["name"];
        Session.set("CURRENTFILE", CURRENTFILE);
        console.log("You uploaded: " + CURRENTFILE);
        Images.insert(newFile, function (error, fileObj) {
	        if (error) {
	          toastr.error("Upload failed... please try again.");
	        } else {
	          toastr.success('Upload succeeded!');
	        }
      	});
    });
  }
});