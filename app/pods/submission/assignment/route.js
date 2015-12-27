import Ember from "ember";

export default Ember.Route.extend({
  //secretKey: null,
  // activate: function() {},
  // deactivate: function() {},
  setupController: function(controller, model) {
    this._super(controller,model);
    controller.set("uploadPercent",0);
    controller.set("markingError","");
    controller.set("uploadError","");
    controller.set("markingGrade",0);
    controller.set("markingResult","");
    controller.set("showResults",false);
    controller.set("markingHappening",false);
    var localStorage = this.get('local-storage');
    var assignmentKey = "a"+model.assignmentNumber;
    var grades = localStorage.get("currentUser").grades[assignmentKey];
    console.log(grades);
    if(grades) {
      controller.set("currentGrade", grades);
    } else {
      controller.set("currentGrade", null);
    }
  },
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

  model: function(params) {
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
