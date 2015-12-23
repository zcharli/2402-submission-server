import Ember from 'ember';
import ResponseErrorMixin from '../../mixins/error-codes';
import StudentModel from '../../models/student-model';

export default Ember.Controller.extend(ResponseErrorMixin, {
  // needs: [],
  successAjaxCall: function(response) {
    if (!this.get("checkResponseSuccessful").call(this, response)) {
      var retString = this.get("getErrorString").call(this, response);
      Materialize.toast("<div style='color:red'>Server error: " + retString + "</div>", 3000);
      return;
    }
    console.log(this);
    var responseData = response.data,
        student = StudentModel.create({
            email: responseData.email,
            stdNumber: responseData.stdNumber,
            secretKey: responseData.secretKey,
            userID: responseData.userID,
            grades: responseData.grades,
            _id: responseData._id
          });
    var self = this;
    var cookie = this.get("cookie");

    // Replace the current localstorage with 
    // this.get('local-storage').add("currentUser", student);

    cookie.setCookie("secretKey", student.secretKey).then(function() {
      self.transitionToRoute("submission");
    });
  },
  actions: {
    verifyUserSecretKey: function(secretKey) {
      console.log("Controller hit " + secretKey);
      var self = this;

      // Verify key for login
      Ember.$.ajax({
        url: self.get('rest-api').getHost() + "/login",
        data: {
          secretKey: secretKey
        },
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        //error: self.get("successAjaxCall"),
        error: function() {
          Materialize.toast("<div style='color:red'>The key you entered was invalid!</div>", 3000);
          
          // Just for testing
          var cookie = self.get("cookie"),
              student = StudentModel.create({
                "email": "dabeluchindubisi",
                "stdNumber": 100907836,
                "secretKey": "a434ce0d2090172e696438f22029befdf39f2aa2",
                "userID": 1001,
                "grades": {},
                "_id": "567a1266171bf9b550869267"
            });
          // Replace the current localstorage with 
          self.get('local-storage').add("currentUser", student);

          cookie.setCookie("secretKey", student.secretKey).then(function() {
            self.transitionToRoute("submission");
          });
        },
        dataType: 'json',
        success: function(response) {
          if (!self.get("checkResponseSuccessful").call(self, response)) {
            var retString = self.get("getErrorString").call(self, response);
            Materialize.toast("<div style='color:red'>Server error: " + retString + "</div>", 3000);
            return;
          }
          console.log(self);
          var responseData = response.data,
              student = StudentModel.create({
                  email: responseData.email,
                  stdNumber: responseData.stdNumber,
                  secretKey: responseData.secretKey,
                  userID: responseData.userID,
                  grades: responseData.grades,
                  _id: responseData._id
                });
          var self = self;
          var cookie = self.get("cookie");

          // Replace the current localstorage with 
          self.get('local-storage').add("currentUser", student);

          cookie.setCookie("secretKey", student.secretKey).then(function() {
            self.transitionToRoute("submission");
          });
        },
        type: 'POST'
      });
    }
  }
});