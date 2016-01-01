import Ember from "ember";

export default Ember.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  beforeModel: function() {
    var cookie = this.get("cookie");
    var token  = cookie.getCookie('secretKey');
   
    if(!token) {
      console.log("Token Missing form Submission route");
      this.transitionTo("application");
    }
  },
  // afterModel: function() {},

  model: function() {
    
  }
});
