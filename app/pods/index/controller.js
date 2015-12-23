import Ember from 'ember';
import ResponseErrorMixin from '../../mixins/error-codes';
import StudentModel from '../../models/student-model';

export default Ember.Controller.extend(ResponseErrorMixin,{
  // needs: [],
  successAjaxCall: function(response) {
    if(!this.get("checkResponseSuccessful").call(this,response))
    {
      var retString = this.get("getErrorString").call(this,response);
      Materialize.toast("<div style='color:red'>"+retString+"</div>", 1500 );
      return;
    }

    var responseData = response.data;
    // Replace the current localstorage with 
    var student = StudentModel.create({
      email: responseData.email,
      stdNumber: responseData.stdNumber,
      secretKey: responseData.secretKey,
      userID: responseData.userID,
      grades: responseData.grades,
      _id: responseData._id 
    });

    this.get('local-storage').add("currentUser",student);

    var self = this;
    var cookie = self.get("cookie");
      
    cookie.setCookie("secretKey",student.secretKey).then(function () {
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
         // data: {
         //    format: 'json'
         // },
         error: function() {
            Materialize.toast("<div style='color:red'>The key you entered was invalid!</div>", 1500 );
         },
         dataType: 'json',
         success: self.get("successAjaxCall"),
         type: 'GET'
      });
    }
  }
});
