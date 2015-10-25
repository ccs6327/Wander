Router.configure({
	layoutTemplate: 'layout',

});

Router.route('/',{
	template: 'login'
});

Router.route('personalInfo',{
	template: 'personalInfo'
});

Router.route('checkout',{
	template: 'checkout'
});

Router.route('cart',{
	template: 'cart'
});

Router.route('list',{
	template: 'list'
});

Router.route('map',{
	template: 'map'
});

Router.route('addItem', {
	template: 'addItem'
});

Router.route('myShop', {
	template: 'myShop'
});

Router.route('/shop/:_id', function() {
	if (this.ready()) {
		this.render('shop', {
			data: function(){
				return Shops.findOne({_id: this.params._id});
			}
		});
	}
});

var requireLogin = function() { 
	if (! Meteor.user()) {
	    // If user is not logged in render landingpage
	    this.render('login'); 
	} else {
		//if user is logged in render whatever route was requested
	    this.next(); 
	}
}

Router.onBeforeAction(requireLogin, {except: ['login']});
