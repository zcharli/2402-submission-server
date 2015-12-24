import Ember from 'ember';
import ResponseErrorMixin from '../../../mixins/error-codes';

export default Ember.Controller.extend(ResponseErrorMixin, {
  // needs: [],
  signUpComponent: null,
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
    generateUserSecretKey: function(userObj, success, fail) {
      var restRoute = this.get('rest-api').getHost() + "/secretCode/generateKey",
          self = this;
      console.log("componet: " + this.get('signUpComponent'));
      Ember.$.ajax({
        url: restRoute,
        data: {
          email: userObj.studentUsername,
          studentid: userObj.studentNumber
        },
        crossDomain: true,
        // xhrFields: {
        //   withCredentials: true
        // },
        error: fail,
        dataType: 'json',
        success: success,
        type: 'POST'
      });

      console.log("User " + userObj.studentNumber + " " + userObj.studentUsername + " submitted details to generate key");
    }
  }
});