import Ember from "ember";

export default Ember.Route.extend({
  //secretKey: null,
  // activate: function() {},

  // turnOffCounter: function() {
  //   console.log("Deactivated");
  //   //var controller = this.get("controller");
  //   clearInterval(this.controller.get("countDownTimer"));
  // }.on("deactivate"),
  validParams: ['1','2','2x','3','3x','4','4x','5','5x'],
  setupController: function(controller, model) {
    this._super(controller,model);
    controller.set("uploadPercent",0);
    controller.set("markingError","");
    controller.set("uploadError","");
    controller.set("markingGrade",0);
    controller.set("markingResult","");
    controller.set("showResults",false);
    controller.set("markingHappening",false);
    if(model) {
      var localStorage = this.get('local-storage');
      var assignmentKey = "a"+model.assignmentNumber;
      var currentUser = localStorage.get("currentUser");
      var grades = currentUser.grades[assignmentKey];
      if(grades) {
        controller.set("currentGrade", grades);
      } else {
        controller.set("currentGrade", null);
      }

      var deadlines = localStorage.get("deadlines"),
          today = new Date();
      if(deadlines) {
        var thisDeadline = deadlines[assignmentKey];
        var deadLineDate = new Date(thisDeadline);
        if(thisDeadline) {
          if(today > deadLineDate) {
            controller.set("pastDeadline", true);
          } else {
            controller.set("pastDeadline", false);
          }
          controller.set("deadLineDate",deadLineDate);
          controller.set("countDownTimer",null);
        }
      } else {
        Materialize.toast("<div style='color:red'>Failed to find deadlines for assignment. Contact professor");
      }
      
      Ember.run.scheduleOnce('afterRender', this, function() {
        Ember.$(".assignment-list li.active").removeClass("active");
        Ember.$(".assignment-list #"+assignmentKey).addClass("active");
      });
    }
    
  },
  // renderTemplate: function() {},
  beforeModel: function() {
    var cookie = this.get("cookie");
    var token  = cookie.getCookie('secretKey');
    if(!token) {
      //console.log("Token Missing from assignment route");
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
    var validAssignments = this.get("validParams");
    if(!validAssignments.contains(assignmentNumber)) {
      this.transitionTo("submission.error");
    } else {
      return Ember.RSVP.hash({
        assignmentNumber: assignmentNumber
      });
    }
    
  },
  actions: {
    willTransition: function() {
      clearInterval(this.controller.get("countDownTimer"));
      this.controller.set("countDownTimer", null);
      this.controller.set("pastDeadline", null);
    }
  }
});
