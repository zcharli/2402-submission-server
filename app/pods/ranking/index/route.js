import Ember from "ember";

export default Ember.Route.extend({
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  secretKey: null,
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  beforeModel: function() {
    var cookie = this.get("cookie");
    var token  = cookie.getCookie('secretKey');
    if(!token) {
      console.log("Token Missing from rankings route");
      this.transitionTo("application");
    } else {
      this.set("secretKey", token);
    }
  },
  // afterModel: function() {},

  model: function() {
      return ;
  }
});
