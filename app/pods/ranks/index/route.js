import Ember from "ember";
import SideBarGenerator from '../../../mixins/assignment-list-generator';

export default Ember.Route.extend(SideBarGenerator, {
  // activate: function() {},
  // deactivate: function() {},
  // setupController: function(controller, model) {},
  // renderTemplate: function() {},
  secretKey: null,
  // activate: function() {},
  // deactivate: function() {},
  setupController: function(controller, model) {
    this._super(controller, model);
    var localStorage = this.get("local-storage"),
      deadlines = localStorage.get("deadlines"),
      assignmentObjects = {};
    if (deadlines && model.assignmentRanks) {
      var serverResponse = model.assignmentRanks;
      if (serverResponse.hasOwnProperty("data")) {
        if (serverResponse.responseType === "error") {
          Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i>Could not fetch ranks at this moment</div>", 3000);
        } else {
          assignmentObjects = this.get("generateAssignmentObjectArray").call(this, deadlines, serverResponse);
        }
      }
      controller.set("assignmentObjectArray", assignmentObjects);
      controller.set("assignmentRankingObjects", serverResponse);
      controller.set("storage", localStorage);
    }
  },
  // renderTemplate: function() {},
  // beforeModel: function() {
  //   var cookie = this.get("cookie");
  //   var token  = cookie.getCookie('secretKey');
  //   if(!token) {
  //     console.log("Token Missing from rankings route");
  //     this.transitionTo("application");
  //   } else {
  //     this.set("secretKey", token);
  //   }
  // },
  // afterModel: function() {},

  model: function() {
    var assignmentRequestCall = this.get('rest-api').getHost() + "/ranking?secretKey=" + this.get('local-storage').get("currentUser").secretKey;
    return Ember.RSVP.hash({
      assignmentRanks: Ember.$.get(assignmentRequestCall)
    });
  }
});