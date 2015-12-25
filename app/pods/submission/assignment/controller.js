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

  assignmentSubmissionRestRoute: Ember.computed("assignmentNumber", function() {
    return "assignment" + this.get('assignmentNumber');
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

  successAjaxCall: function(results) {
    if (!this.get('checkResponseSuccessful').call(this, results)) {
      var errorMessage = this.get('getErrorString').call(this, results);
      Materialize.toast("<div style='color:red'>Server error: " + errorMessage + ".</div>", 3000);
    } else {
      var message = "The email was successfully sent to " + results.data.email;
      Materialize.toast(message, 3000);
    }
  },

  findGradeFromResult: function(resultText) {
    var grade = 0;
    var lastTotalLine = resultText[resultText.length - 1];
    var split = lastTotalLine.split(" ");
    var gradeFraction = split[split.length-1];
    console.log(gradeFraction);
    var numFractionSplit = gradeFraction.match(/\d+/g);
    if(numFractionSplit.length < 2) {
      console.log("Fractions are wrong");
    } else {
      grade  =  numFractionSplit[0] / numFractionSplit[1];
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
    },
    sendResultsToStudentEmail: function() {
      var restApiParam = "a" + this.get('assignmentNumber'),
        restRoute = this.get('rest-api').getHost() + "/results/" + restApiParam,
        secretKey = this.get('local-storage').get("currentUser").secretKey,
        self = this;

      console.log("Sending results to current user by secretKey: " + secretKey);
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
        },
        type: 'GET'
      });

    },
    uploadProgressChanged: function(percent) {
      console.log(percent + "% completed");
      this.set("uploadPercent", percent);
    },
    uploadCompleted: function(error) {
      // Catches success and fail case of upload
      if (error) {
        Materialize.toast("<div style='color:red'>Assignment upload error!</div>", 3000);
        console.log("Upload complete error: " + error);
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
      console.log(result);
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
        this.set("markingResult", this.get('htmlEntities').call(this, result.data.markingLog.join(" ")));

        var markingGrade = result.data.student.grades["a"+this.get("assignmentNumber")];
        //this.get('findGradeFromResult').call(this, result.data.markingLog);
        this.set("markingGrade", markingGrade);
        this.set("showResults", true);

        var currentMark = this.get("currentGrade");

        if (markingGrade > currentMark) {
          this.set("currentGrade", markingGrade);
        }

      }
    }
  }
});