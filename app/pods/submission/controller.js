import Ember from 'ember';

export default Ember.Controller.extend({
  // needs: [],
  userName: null,
  init: function() {
    this._super();
    var localStorage = this.get('local-storage');
    var currentUser = localStorage.get('currentUser');
    this.set("userName",currentUser.email);
  },
  currentLoggedInUser: Ember.computed("userName", function() {
    return this.get("userName");
  }),
  actions: {
    logout: function() {

      this.transitionToRoute("application");
    }
  }
});