import Ember from "ember";
import SideBarGenerator from '../../mixins/assignment-list-generator';
export default Ember.Route.extend(SideBarGenerator, {
  // activate: function() {},
  // deactivate: function() {},
  setupController: function(controller,model) {
    this._super(controller, model);
    var localStorage = this.get("local-storage"),
      deadlines = localStorage.get("deadlines");
    if (deadlines) {
      var assignmentObjects = this.get("generateAssignmentObjectArray").call(this, deadlines);
      controller.set("assignmentObjectArray", assignmentObjects);
      controller.set("storage", localStorage);
    }
  },
  // renderTemplate: function() {},
  beforeModel: function() {
    var cookie = this.get("cookie");
    var token = cookie.getCookie('secretKey');

    if (!token) {
      this.transitionTo("application");
    }
  },
  // afterModel: function() {},

  model: function() {

  }
});