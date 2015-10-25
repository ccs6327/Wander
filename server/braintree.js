var gateway;

Meteor.startup(function () {
  var braintree = Meteor.npmRequire('braintree');
  gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    publicKey: Meteor.settings.BT_PUBLIC_KEY,
    privateKey: Meteor.settings.BT_PRIVATE_KEY,
    merchantId: Meteor.settings.BT_MERCHANT_ID
  });
});

Meteor.methods({
  getClientToken: function (customerId) {

    var generateToken = Meteor.wrapAsync(gateway.clientToken.generate, gateway.clientToken);
    var options = {};

    if (customerId) {
      options.customerId = customerId;
    }

    var response = generateToken(options);

    return response.clientToken;
  },

  createTransaction: function (data) {
    var transaction = Meteor.wrapAsync(gateway.transaction.sale, gateway.transaction);

    var response = transaction({
      amount: data.amount,
      paymentMethodNonce: data.nonce,
      options: {
        storeInVaultOnSuccess: true
      },
      customer: {
        firstName: data.firstName,
        lastName: data.lastName
      }
    });

    return response;
  }
});
