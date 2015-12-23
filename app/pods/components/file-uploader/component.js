import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  markingRouteParameter: '',
  filesDidChange: function(files) {
    var uploadUrl = this.get('rest-api').getHost() + '/marking/' + this.get('markingRouteParameter'),
      self = this;

    console.log(uploadUrl);

    var uploader = EmberUploader.Uploader.create({
      url: uploadUrl
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
        error["successCode"] = 2002;
        error.data = {};
        error.data.markingGrade = 96.5;
        error.data.markingLog = "This is a line \n this another line ok \n\n this is a paragraph";
        self.sendAction("markingCompletedCallback", error);
      });
    }
  }
});