import Ember from "ember";

export default Ember.Route.extend({
  secretKey: null,
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  beforeModel: function() {
    var cookie = this.get("cookie");
    var token  = cookie.getCookie('secretKey');
    if(!token) {
      console.log("Token Missing from assignment route");
      this.transitionTo("application");
    } else {
      this.set("secretKey", token);
    }
  },
  // afterModel: function() {},

  model: function(params, transition) {
    var assignmentNumber = params.assignmentNumber;
    if(!assignmentNumber) {
      console.log("No transition number was given to this route!");
      this.transitionTo("application");
    }  
    return Ember.RSVP.hash({
      assignmentNumber: assignmentNumber
    });
  }
});
