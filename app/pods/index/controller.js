import Ember from 'ember';

export default Ember.Controller.extend({
  // needs: [],
  actions: {
    verifyUserSecretKey: function(secretKey) {
      console.log("Controller hit " + secretKey);
      var self = this;
      var cookie = this.get("cookie");
      
      cookie.setCookie("secretKey",secretKey).then(function () {
        self.transitionToRoute("submission");
      });

    }
  }
});
