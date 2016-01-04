import Ember from 'ember';
import ResponseErrorMixin from '../../mixins/error-codes';
import StudentModel from '../../models/student-model';

export default Ember.Controller.extend(ResponseErrorMixin, {
  //needs: ["application"],
  applicationController: Ember.inject.controller("application"),
  // successAjaxCall: function(response) {
  //   if (!this.get("checkResponseSuccessful").call(this, response)) {
  //     var retString = this.get("getErrorString").call(this, response);
  //     Materialize.toast("<div style='color:red'>Server error: " + retString + "</div>", 3000);
  //     return;
  //   }
  //   console.log(this);
  //   var responseData = response.data,
  //       student = StudentModel.create({
  //           email: responseData.email,
  //           stdNumber: responseData.stdNumber,
  //           secretKey: responseData.secretKey,
  //           userID: responseData.userID,
  //           grades: responseData.grades,
  //           _id: responseData._id
  //         });
  //   var self = this;
  //   var cookie = this.get("cookie");

  //   // Replace the current localstorage with 
  //   this.get('local-storage').add("currentUser", student);

  //   cookie.setCookie("secretKey", student.secretKey).then(function() {
  //     self.transitionToRoute("submission");
  //   });
  // },
  actions: {
    verifyUserSecretKey: function(secretKey) {
      var self = this;

      // Verify key for login
      Ember.$.ajax({
        url: self.get('rest-api').getHost() + "/login",
        data: {
          secretKey: secretKey
        },
        crossDomain: true,
        error: function() {
          Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i> The key you entered was invalid!</div>", 3000);
        },
        dataType: 'json',
        success: function(response) {

          if (!self.get("checkResponseSuccessful").call(self, response)) {
            var retString = self.get("getErrorString").call(self, response);
            Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i> Server error: " + retString + "</div>", 3000);
            return;
          }
          var responseData = response.data.student,
            student = StudentModel.create({
              email: responseData.email,
              stdNumber: responseData.stdNumber,
              secretKey: responseData.secretKey,
              userID: responseData.userID,
              grades: responseData.grades,
              _id: responseData._id
            });

          var cookie = self.get("cookie");
          // Replace the current localstorage with 
          self.get('local-storage').add("currentUser", student);
          Materialize.toast("<i class='material-icons left'>perm_identity</i> Welcome", 3000);
          self.set('applicationController.userLoggedIn', student.email);
          cookie.setCookie("secretKey", student.secretKey).then(function() {
            self.transitionToRoute("submission");
          });
        },
        type: 'POST'
      });
    }
  }
});