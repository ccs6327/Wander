Session.set('paymentFormStatus', null);
var isBraintreeInitialized = false;

function serializeForm ($form) {
    var $inputs = $form.find('input, select, textarea');

    return _.reduce($inputs, function (data, input) {
        var name = input.name;

        if (name) {
          data[name] = input.value;
        }

        return data;
    }, {});
}

function initializeBraintree (clientToken) {
    if (isBraintreeInitialized) return;

    braintree.setup(clientToken, 'dropin', {
        container: 'dropin',
        paymentMethodNonceReceived: function (event, nonce) {
            Session.set('paymentFormStatus', true);

            var data = serializeForm($('#checkout'));
            console.log(data.amount);
            data.nonce = nonce;

            Meteor.call('createTransaction', data, function (err, result) {
                console.log(result);
                var isSuccess = result.success;
                var braintreeId = result.transaction.customer.id;
                if (isSuccess) {
                    Meteor.users.update({_id: Meteor.userId()}, {$set:{"profile.braintreeId": braintreeId}});
                    //remove carts
                    var carts = Carts.find({buyerId: Meteor.userId()}).fetch();
                    for (x in carts){
                        var item = Items.findOne({_id: carts[x]["itemId"]});
                        var shop = Shops.findOne({_id: item["shopId"]});
                        Transactions.insert({
                            buyerId: Meteor.userId(),
                            sellerId: shop["owner"],
                            price: item["price"],
                            itemId: item["_id"],
                            createdAt: new Date()
                        }, function(err, result) {
                            console.log(err);
                        });
                        var cartId = carts[x]["_id"];
                        Carts.remove({_id: cartId});
                    }
                }
                Session.set('paymentFormStatus', null);
                Router.go('confirmation');
            });
        }
    });

    isBraintreeInitialized = true;
}

Template.checkout.helpers({
    paymentFormStatusClass: function () {
        return Session.get('paymentFormStatus') ? 'payment-form__is-submitting' : '';
    },
    amount: function() {
        var carts = Carts.find({buyerId: Meteor.userId()}).fetch();
        var total = 0.0;
            
        for (x in carts){
            var itemId = carts[x]["itemId"];
            var item = Items.findOne({_id: itemId});
            total += parseFloat(item["price"]); 
        }
        return total
    }
});

Template.checkout.rendered = function () {
    var currentUser = Meteor.user();
    var userProfile = currentUser.profile;
    var braintreeId;
    if (typeof userProfile !== "undefined") {
        braintreeId = userProfile.braintreeId;
    }

    Meteor.call('getClientToken', braintreeId, function (err, clientToken) {
        if (err) {
            console.log('There was an error', err);
            return;
        }
        initializeBraintree(clientToken);
    });
};

Template.confirmation.helpers({
    destination: function(){
        var lastestTransaction = Transactions.findOne({buyerId: Meteor.userId()}, {sort: {createdAt: -1}});
        var item = Items.findOne({_id: lastestTransaction["itemId"]});
        var shop = Shops.findOne({_id: item["shopId"]});
        return "https://www.google.com/maps?q=" + shop["shopLat"] + "," + shop["shopLng"];
    }
});