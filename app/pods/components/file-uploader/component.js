import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  url: '',
  filesDidChange: function(files) {
    var uploadUrl = this.get('url'),
             self = this;

    console.log(uploadUrl);

    var uploader = EmberUploader.Uploader.create({
      url: uploadUrl
    });


    if (!Ember.isEmpty(files)) {
      var promise = uploader.upload(files[0]);
      self.sendAction("uploadStartedCallback",true);

      uploader.on('progress', function(e){
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
        data["statusText"] = 200;
        self.sendAction("markingCompletedCallback", data);
      }, function(error) {
        //Handle failure
        // error["statusText"] = 200;
        // error["resultGrade"] = 96.5;
        // error["resultString"] = "Ok <br> fuck <br> heme \n ok \n line";
        self.sendAction("markingCompletedCallback", error);
      });
    }
  }
});