import Ember from 'ember';
import ResponseErrorMixin from '../../../mixins/error-codes';

export default Ember.Controller.extend(ResponseErrorMixin, {
  // needs: [],
  successAjaxCall: function(result) {
    if (!this.get('checkResponseSuccessful').call(this, result)) {
      var errorMessage = this.get('getErrorString').call(this, result);
      Materialize.toast("<div style='color:red'>Server error: " + errorMessage + "</div>", 3000);
    } else {
      var message = "The secret key was successfully generated and sent to your email: " + result.data.email;
      Materialize.toast(message, 3000);
    }
  },

  actions: {
    generateUserSecretKey: function(userObj) {
      var restRoute = this.get('rest-api').getHost() + "/secretCode/generateKey",
          self = this;
      Ember.$.ajax({
        url: restRoute,
        data: {
          email: userObj.studentUsername,
          studentNumber: userObj.studentNumber
        },
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        error: function() {
          Materialize.toast("<div style='color:red'>Server error while sending results to you.</div>", 3000);
        },
        dataType: 'json',
        success: function(result) {
          if (!self.get('checkResponseSuccessful').call(self, result)) {
            var errorMessage = self.get('getErrorString').call(self, result);
            Materialize.toast("<div style='color:red'>Server error: " + errorMessage + "</div>", 3000);
          } else {
            var message = "The secret key was successfully generated and sent to your email: " + result.data.email;
            Materialize.toast(message, 3000);
          }
        },
        type: 'POST'
      });

      console.log("User " + userObj.studentNumber + " " + userObj.studentUsername + " submitted details to generate key");
    }
  }
});