import Ember from 'ember';
import ResponseErrorMixin from '../../../mixins/error-codes';
import HtmlHelpers from '../../../mixins/html-helpers';

export default Ember.Controller.extend(ResponseErrorMixin, HtmlHelpers, {
  // needs: [],
  uploadPercent: 0,
  markingError: "",
  markingResult: "",
  markingGrade: 0,
  markingHappening: false,
  uploadError: "",
  showResults: false,
  currentGrade: null,
  enableEmailPrepareSpinner: false,
  pastDeadline: false,

  assignmentSubmissionRestRoute: Ember.computed("assignmentNumber", function() {
    return "a" + this.get('assignmentNumber');
  }),

  assignmentNumber: Ember.computed("model", function() {
    return this.get('model')["assignmentNumber"];
  }),
  progress: Ember.computed("uploadPercent", function() {
    var safePercent = escape(this.get('uploadPercent'));
    return new Ember.Handlebars.SafeString("width: " + safePercent + "%");
  }),
  assignmentHasBeenMarked: Ember.computed("showResults", function() {
    var showResultSection = this.get('showResults');
    if (showResultSection) {
      return new Ember.Handlebars.SafeString("display: block");
    } else {
      return new Ember.Handlebars.SafeString("display: none");
    }
  }),
  assignmentCurrentlyBeingMarked: Ember.computed("markingHappening", function() {
    var showMarkingSpinner = this.get('markingHappening');
    if (showMarkingSpinner) {
      return new Ember.Handlebars.SafeString("display: block");
    } else {
      return new Ember.Handlebars.SafeString("display: none");
    }
  }),

  displayPastDeadlineMessage: Ember.computed("pastDeadline", function() {
    var assignmentOverdue = this.get("pastDeadline");
    if(assignmentOverdue) {
      this.get('enableDisableFileUploader').call(this, false);
      return new Ember.Handlebars.SafeString("<div style='color:red'>Due date has passed</div>");
    } else {
      this.get('enableDisableFileUploader').call(this, true);
      return "";
    }
  }),
  displayAssignmentNumber: Ember.computed("assignmentNumber", function() {
    var assignmentNumber = this.get("assignmentNumber");
    if (/\x$/g.test(assignmentNumber)) {
      // Contains the X
      var text = assignmentNumber.match(/\d+/);
      if (text.length < 1) {
        // ERROR!
        return 0;
      } else {
        return new Ember.Handlebars.SafeString("<b>" + text[0] + " Challenge</b>");
      }
    } else {
      return new Ember.Handlebars.SafeString(assignmentNumber);
    }
  }),
  displayBestGrade: Ember.computed("currentGrade", function() {
    var bestMarkToDate = this.get("currentGrade");
    if (bestMarkToDate) {
      return new Ember.Handlebars.SafeString("Best mark: " + bestMarkToDate + "%");
    } else {
      return new Ember.Handlebars.SafeString("No submissions");
    }
  }),
  displayMarkingGrade: Ember.computed("markingGrade", function() {
    var grade = this.get("markingGrade");
    return new Ember.Handlebars.SafeString("Your grade is " + grade + "%.");
  }),
  displayMarkingResult: Ember.computed("markingResult", function() {
    return new Ember.Handlebars.SafeString(this.get("markingResult"));
  }),
  displayMarkingError: Ember.computed("markingError", function() {
    var markingErrorObj = this.get('markingError');
    if (markingErrorObj) {
      return new Ember.Handlebars.SafeString(markingErrorObj.statusText +
        ": " + markingErrorObj.responseText);
    } else {
      return "";
    }
  }),
  displayUploadError: Ember.computed("uploadError", function() {
    return new Ember.Handlebars.SafeString(this.get('uploadError'));
  }),

  resetForm: function() {
    // Used to remvoe the form name and reset for next upload
    Ember.$(".filepicker form").trigger("reset");
  },
  enableDisableFileUploader: function(enable) {
    if(enable) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        Ember.$(".filepicker form input").prop("disabled",false);
        Ember.$(".filepicker form input").css("opacity",1);
      });
    } else {
      Ember.run.scheduleOnce('afterRender', this, function() {
        Ember.$(".filepicker form input").prop("disabled",true);
        Ember.$(".filepicker form input").css("opacity",0.3);
      });
    }
  },

  findGradeFromResult: function(resultText) {
    var grade = 0;
    var lastTotalLine = resultText[resultText.length - 1];
    var split = lastTotalLine.split(" ");
    var gradeFraction = split[split.length - 1];
    var numFractionSplit = gradeFraction.match(/\d+/g);
    if (numFractionSplit.length < 2) {
      console.log("Mathematical Error! Write an angry email to charlieli@cmail.carleton.ca about this!");
    } else {
      grade = numFractionSplit[0] / numFractionSplit[1];
    }
    return grade;
  },
  actions: {
    errorDuringUpload: function(errorCode) {
      switch (errorCode) {
        case 1:
          // Not logged in/no user storage
          Materialize.toast("<div style='color:red'>Please login first.</div>", 3000);

          this.transitionToRoute("application");
          break;
        case 2:
          // Not a zip file
          Materialize.toast("<div style='color:red'>You must upload a zip file!</div>", 3000);

          break;
        default:
          // Unknown
          Materialize.toast("<div style='color:red'>An error occured on the client side during upload!</div>", 3000);

          break;
      }
      this.get("resetForm").call(this);
    },
    sendResultsToStudentEmail: function() {
      this.set("enableEmailPrepareSpinner", true);
      var restApiParam = "a" + this.get('assignmentNumber'),
        restRoute = this.get('rest-api').getHost() + "/results/" + restApiParam,
        secretKey = this.get('local-storage').get("currentUser").secretKey,
        self = this;

      Ember.$.ajax({
        url: restRoute,
        data: {
          secretKey: secretKey
        },
        crossDomain: true,
        // xhrFields: {
        //   withCredentials: true
        // },
        error: function() {
          Materialize.toast("<div style='color:red'>Server error while sending results to you.</div>", 3000);
        },
        dataType: 'json',
        success: function(results) {
          if (!self.get('checkResponseSuccessful').call(self, results)) {
            var errorMessage = self.get('getErrorString').call(self, results);
            Materialize.toast("<div style='color:red'>Server error: " + errorMessage + ".</div>", 3000);
          } else {
            var message = "The email was successfully sent to " + results.data.email;
            Materialize.toast(message, 3000);
          }
          self.set("enableEmailPrepareSpinner", false);
        },
        type: 'GET'
      });

    },
    uploadProgressChanged: function(percent) {
      this.set("uploadPercent", percent);
    },
    uploadCompleted: function(error) {
      // Catches success and fail case of upload
      if (error) {
        Materialize.toast("<div style='color:red'>Assignment upload error!</div>", 3000);
        this.set("uploadError", error);
      } else {
        Materialize.toast("Upload has successfull completed!", 3000);
        this.set("uploadError", "");
      }
      this.set("markingHappening", false);
    },
    markingStarted: function() {
      this.set("markingHappening", true);
    },
    markingCompleted: function(result) {
      // Catches success and fail case of marking completion
      if (!this.get('checkResponseSuccessful').call(this, result)) {
        var message = this.get("getErrorString").call(this, result);
        Materialize.toast("<div style='color:red'>Assignment marking error: " + message + "</div>", 3000);

        if (!result.hasOwnProperty("statusText")) {
          result.statusText = "Error: " + result.responseCode;
          result.responseText = message;
        }
        // Default code below
        this.set("showResults", false);
        this.set("markingResult", "");
        this.set("markingGrade", "");
        this.set("markingError", result);
      } else {
        Materialize.toast("Your assignment has been marked!", 3000);
        this.set("markingError", "");
        console.log(result); 
        if(result.data && result.data.hasOwnProperty("markingLog")) {
          this.set("markingResult", this.get('htmlEntities').call(this, result.data.markingLog.join(" ")));
        } else {
          this.set("markingResult", "Was not able to get results at this time.");
        }

        var markingGrade = result.data.student.grades["a" + this.get("assignmentNumber")];
        //this.get('findGradeFromResult').call(this, result.data.markingLog);
        this.set("markingGrade", markingGrade);
        this.set("showResults", true);

        var currentMark = this.get("currentGrade");

        if (markingGrade > currentMark) {
          this.set("currentGrade", markingGrade);
        }

      }

      this.get("resetForm").call(this);
    }
  }
});