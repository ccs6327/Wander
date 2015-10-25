
Template.addItem.helpers({
	images: function(){
		console.log(Session.get("currentFile"));
		console.log(Images.find({"sessionId": Session.get("tempSessionId")}).fetch());
		return Images.find({"sessionId": Session.get("tempSessionId")});
	}
});

Template.addItem.events({
	"submit .new-item": function(event){
		event.preventDefault();

		var title = event.target.title.value;
		var price = parseFloat(event.target.price.value);
		var quantity = parseInt(event.target.quantity.value);
		var description = event.target.description.value;
		var sessionId = Session.get("tempSessionId");
		var shop = Shops.findOne({owner: Meteor.userId()});

		console.log(title);
		console.log(price);
		console.log(quantity);
		console.log(description);

		delete Session.keys["tempSessionId"];
		if (typeof shop === "undefined"){
			Shops.insert({
				owner: Meteor.userId(),
				name: Meteor.user().emails[0].address,
				likes: 0,
				dislikes: 0,
				isActive: false
			}, function (err, id) {
				console.log(err);

				Items.insert({
					shopId: id, 
					title: title,
					description: description,
					price: price,
					quantity: quantity,
					sessionId: sessionId
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
				quantity: quantity,
				sessionId: sessionId
			}, function (err, id) {
				console.log(err);
				Router.go('/myShop');
			});
		}
	}
});

Template.dropzone.events({
  'dropped #dropzone': function(e) {
  	  if (typeof Session.get("tempSessionId") === "undefined") {
  	  	Session.set("tempSessionId", (new Date()).getTime() + Meteor.userId());
  	  	console.log("session id" + Session.get("tempSessionId"));	
  	  }
  	  
      FS.Utility.eachFile(e, function(file) {
        var newFile = new FS.File(file);
        var currentDate = new Date();
        newFile.name(currentDate.getTime() + newFile.name());
        console.log(newFile.name());
        newFile.sessionId = Session.get("tempSessionId");
        Session.set("currentFile", newFile.name());
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
