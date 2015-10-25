var imageStore = new FS.Store.S3("images", {
  region: "us-west-1",
  /* REQUIRED */
  accessKeyId: Meteor.settings.private.AWSAccessKeyId, 
  secretAccessKey: Meteor.settings.private.AWSSecretAccessKey, 
  bucket: Meteor.settings.private.AWSBucket
});

Images = new FS.Collection("Images", {
  stores: [imageStore],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});