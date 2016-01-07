import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  markingRouteParameter: '',
  checkUploadFile: function(filename) {
    return filename === this.get("expectedZipFileName");
  },
  filesDidChange: function(files) {

    if (files.length !== 1 || !this.get("checkUploadFile").call(this, files[0].name)) {
      this.sendAction("uploadError", 2);
      return;
    }


    var localStorage = this.get("local-storage");
    var currentUser = localStorage.get('currentUser');
    if (!currentUser || !currentUser.secretKey) {
      this.sendAction("uploadError", 1);
    }

    var uploadUrl = this.get('rest-api').getHost() +
      '/marking/' +
      this.get('markingRouteParameter') + '/?secretKey=' +
      currentUser.secretKey,
      self = this;

    var uploader = EmberUploader.Uploader.create({
      url: uploadUrl,
      paramName: 'submission',
      secretKey: currentUser.secretKey
    });

    if (!Ember.isEmpty(files)) {
      var promise = uploader.upload(files[0]);
      self.sendAction("uploadStartedCallback", true);

      uploader.on('progress', function(e) {
        // e.percent
        self.sendAction("uploadProgressCallback", e.percent);
      });

      uploader.on('didUpload', function(e) {
        // Handle finished upload
        self.sendAction("uploadCallback", null);
      });

      uploader.on('didError', function(jqXHR, textStatus, errorThrown) {
        // Handle unsuccessful upload
        self.sendAction("uploadCallback", errorThrown);
      });

      promise.then(function(data) {
        // Handle success
        data["successCode"] = 2002;
        self.sendAction("markingCompletedCallback", data);
      }, function(error) {
        //Handle failure
        self.sendAction("markingCompletedCallback", error);
      });
    }
  }
});