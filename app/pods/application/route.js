import Ember from "ember";

export default Ember.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  beforeModel: function() {
    var cookie = this.get("cookie");
    var token = cookie.getCookie('secretKey');
    if (!token) {
      console.log("Token Missing from assignment route");
      this.transitionTo("application");
    }
  },
  // afterModel: function() {},
  // setupController: function(controller, model){
  // },
  model: function() {
    return;
  },
});