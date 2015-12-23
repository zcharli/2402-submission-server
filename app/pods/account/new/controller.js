import Ember from 'ember';

export default Ember.Controller.extend({
  // needs: [],
  actions: {
    generateUserSecretKey: function(userObj) {
      console.log("User "+ userObj.studentNumber + " "+ userObj.studentUsername +" submitted details to generate key");
    }
  }
});
