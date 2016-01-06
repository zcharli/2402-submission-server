import Ember from 'ember';
import SideBarGenerator from '../../mixins/assignment-list-generator';

export default Ember.Controller.extend(SideBarGenerator, {
  // needs: [],
  userName: null,
  assignmentObjectArray: [],
  storage: null,
  displayAssignmentObjectArray: Ember.computed("assignmentObjectArray", function(){
    return this.get("assignmentObjectArray");
  }),

  init: function() {
    this._super();
    var localStorage = this.get('local-storage');
    var currentUser = localStorage.get('currentUser');
    this.set("userName", currentUser.email);
  },

  currentLoggedInUser: Ember.computed("userName", function() {
    return this.get("userName");
  }),

  assignmentObjectObserver: function() {
    var localStorage = this.get("storage"),
      deadlines = localStorage.get("deadlines");

    if (deadlines) {
      this.set("assignmentObjectArray", this.get("generateAssignmentObjectArray").call(this, deadlines));
    }

  }.observes("storage.deadlines"),

  actions: {
    logout: function() {

      this.transitionToRoute("application");
    }
  }
});