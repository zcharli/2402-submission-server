import Ember from 'ember';

export default Ember.Controller.extend({
  // needs: [],
  uploadPercent: 0,
  markingError: "",
  markingResult: "",
  markingGrade: 0,
  markingHappening:false,
  uploadError: "",
  showResults: false,


  assignmentNumber: Ember.computed("model", function() {
    return this.get('model')["assignmentNumber"];
  }),
  progress: Ember.computed("uploadPercent", function() {
    var safePercent = escape(this.get('uploadPercent'));
    return new Ember.Handlebars.SafeString("width: " + safePercent + "%");
  }),
  assignmentHasBeenMarked: Ember.computed("showResults",function() {
    var showResultSection = this.get('showResults');
    if(showResultSection) {
      return new Ember.Handlebars.SafeString("display: block");
    } else {
      return new Ember.Handlebars.SafeString("display: none");
    }
  }),
  assignmentCurrentlyBeingMarked: Ember.computed("markingHappening",function(){
    var showMarkingSpinner = this.get('markingHappening');
    if(showMarkingSpinner) {
      return new Ember.Handlebars.SafeString("display: block");
    } else {
      return new Ember.Handlebars.SafeString("display: none");
    }
  }),

  displayMarkingGrade: Ember.computed("markingGrade",function(){
    var grade = this.get("markingGrade");
    return new Ember.Handlebars.SafeString("Your grade is "+ grade + "%.");
  }),
  displayMarkingResult: Ember.computed("markingResult",function() {
    return new Ember.Handlebars.SafeString(this.get("markingResult"));
  }),
  displayMarkingError: Ember.computed("markingError", function(){
    var markingErrorObj = this.get('markingError');
    if(markingErrorObj) {
      return new Ember.Handlebars.SafeString(markingErrorObj.statusText +
        ": "+ markingErrorObj.responseText);
    } else {
      return "";
    }
  }),
  displayUploadError: Ember.computed("uploadError", function(){
    return new Ember.Handlebars.SafeString(this.get('uploadError'));
  }),

  replaceLineBreaks: function(text) {
    var escapedText = escape(text);
    return escapedText.replace(/%0A/,'<br>');
  },

  actions: {
    sendResultsToStudentEmail: function() {

    },
    uploadProgressChanged: function(percent) {
      console.log(percent +"% completed");
      this.set("uploadPercent", percent);
    },
    uploadCompleted: function(error) {
      // Catches success and fail case of upload
      if(error) {
        Materialize.toast("<div style='color:red'>Assignment upload error!</div>", 1500 );
        console.log("Upload complete error: "+error);
        this.set("uploadError", error);
      } else {
        Materialize.toast("Upload has successfull completed!", 1500 );
        this.set("uploadError", "");
      }
      this.set("markingHappening",false);
    },
    markingStarted: function() {
      this.set("markingHappening", true);
    },
    markingCompleted: function(result) {
      // Catches success and fail case of marking completion
      if(result.statusText !== 200) {
        Materialize.toast("<div style='color:red'>Assignment marking error!</div>", 1500 );
        console.log(result);
        this.set("markingError",result);
      } else {
        Materialize.toast("Your assignment has been marked!", 1500 );
        this.set("markingError","");
        this.set("markingResult",result.resultString);
        this.set("markingGrade",result.resultGrade);
        this.set("showResults",true);
      }
    }
  }
});
