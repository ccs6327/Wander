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
            data.nonce = nonce;

            Meteor.call('createTransaction', data, function (err, result) {
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
    }
});

Template.checkout.rendered = function () {
    Meteor.call('getClientToken', function (err, clientToken) {
        if (err) {
            console.log('There was an error', err);
            return;
        }
        initializeBraintree(clientToken);
    });
};