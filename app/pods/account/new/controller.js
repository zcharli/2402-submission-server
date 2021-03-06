import Ember from 'ember';
import ResponseErrorMixin from '../../../mixins/error-codes';

export default Ember.Controller.extend(ResponseErrorMixin, {
  // needs: [],
  signUpComponent: null,
  successAjaxCall: function(result) {
    if (!this.get('checkResponseSuccessful').call(this, result)) {
      var errorMessage = this.get('getErrorString').call(this, result);
      Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i> Server error: " + errorMessage + "</div>", 3000);
    } else {
      var message = "<i class='material-icons left'>thumb_up</i> The secret key was successfully generated and sent to your email: " + result.data.email;
      Materialize.toast(message, 3000);
    }
  },

  actions: {
    generateUserSecretKey: function(userObj, success, fail) {
      var restRoute = this.get('rest-api').getHost() + "/secretCode/generateKey";
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
    }
  }
});