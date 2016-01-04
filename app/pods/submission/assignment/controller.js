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
  displayCountDown: "",
  countDownTimer: null,
  storage: null,
  deadLineDate: null,

  deadLineDateObserver: function() {
    var localStorage = this.get("storage"),
        deadlines = localStorage.get("deadlines"),
        assignmentNumber = this.get("assignmentNumber");
    var dueDate = new Date(deadlines["a"+assignmentNumber]);
    var today = new Date();
    if(today > dueDate) {
      this.set("pastDeadline", true);
    } else {
      this.set("pastDeadline", false);
    }
    this.set("deadLineDate",new Date(dueDate));

  }.observes("storage.deadlines"),


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
    if (assignmentOverdue) {
      this.set("displayCountDown", "");
      this.get('enableDisableFileUploader').call(this, false);
      return new Ember.Handlebars.SafeString("<div style='color:red'><i class='material-icons left' style='padding-top:7px'>assignment_late</i> Due date has passed </div>");
    } else {
      this.get('enableDisableFileUploader').call(this, true);
      this.get('startCountdown').call(this);
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

  startCountdown: function() {
    var dueDate = this.get("deadLineDate"),
      _second = 1000,
      _minute = _second * 60,
      _hour = _minute * 60,
      _day = _hour * 24,
      self = this;
    var printer = function(d,h,m,s) {
      return d+"days "+h+"hrs "+m+"mins "+s+"secs";
    };

    var showRemaining = function() {
      var now = new Date();
      var distance = dueDate - now;

      if (distance < 0) {
        clearInterval(this.get("countDownTimer"));
        self.set("pastDeadline", true);
        return;
      }
      var days = Math.floor(distance / _day);
      var hours = Math.floor((distance % _day) / _hour);
      var minutes = Math.floor((distance % _hour) / _minute);
      var seconds = Math.floor((distance % _minute) / _second);
      self.set("displayCountDown", printer(days,hours,minutes,seconds));
    };

    if(dueDate) {
      // Now the timer will not go off if any error occurs while getting the
      // deadlines
      this.set("countDownTimer", setInterval(showRemaining, 1000));
    }
  },
  resetForm: function() {
    // Used to remvoe the form name and reset for next upload
    Ember.$(".filepicker form").trigger("reset");
  },
  enableDisableFileUploader: function(enable) {
    if (enable) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        Ember.$(".filepicker form input").prop("disabled", false);
        Ember.$(".filepicker form input").css("opacity", 1);
      });
    } else {
      Ember.run.scheduleOnce('afterRender', this, function() {
        Ember.$(".filepicker form input").prop("disabled", true);
        Ember.$(".filepicker form input").css("opacity", 0.3);
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
          Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i> Please login first.</div>", 3000);

          this.transitionToRoute("application");
          break;
        case 2:
          // Not a zip file
          Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i> You must upload a zip file!</div>", 3000);

          break;
        default:
          // Unknown
          Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i> An error occured on the client side during upload!</div>", 3000);

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
          Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i> Server error while sending results to you.</div>", 3000);
        },
        dataType: 'json',
        success: function(results) {
          if (!self.get('checkResponseSuccessful').call(self, results)) {
            var errorMessage = self.get('getErrorString').call(self, results);
            Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i> Server error: " + errorMessage + ".</div>", 3000);
          } else {
            var message = "<i class='material-icons left'>email</i> The email was successfully sent to " + results.data.email;
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
        Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i> Assignment upload error!</div>", 3000);
        this.set("uploadError", error);
      } else {
        Materialize.toast("<i class='material-icons left'>thumb_up</i> Upload has successfull completed!", 3000);
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
        Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i> Assignment marking error: " + message + "</div>", 3000);

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
        Materialize.toast("<i class='material-icons left'>thumb_up</i> Your assignment has been marked!", 3000);
        this.set("markingError", "");
        if (result.data && result.data.hasOwnProperty("markingLog")) {
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