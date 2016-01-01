import Ember from 'ember';
import ResponseErrorMixin from '../../../mixins/error-codes';

export default Ember.Component.extend(ResponseErrorMixin, {
  studentNumber: null,
  studentUsername: null,
  tagName: 'div',
  classNames: ["sign-up-section"],
  showButton: true,
  showSpinner: false,
  displayButton: Ember.computed("showButton", function() {
    var showFlag = this.get("showButton");
    if (showFlag) {
      return new Ember.Handlebars.SafeString("display: block");
    } else {
      return new Ember.Handlebars.SafeString("display: none");
    }
  }),
  displaySpinner: Ember.computed("showSpinner", function() {
    var showFlag = this.get("showSpinner");
    if (showFlag) {
      return new Ember.Handlebars.SafeString("display: block");
    } else {
      return new Ember.Handlebars.SafeString("display: none");
    }
  }),
  init: function() {
    this._super();
    this.set('register-as', this); // register-as is a new property
  },
  didInsertElement: function() {

  }.on('didInsertElement'),
  switchLoadingButtons: function() {
    var isSpinning = this.get("showSpinner");
    if (isSpinning) {
      this.set("showButton", true);
      this.set("showSpinner", false);
    } else {
      this.set("showButton", false);
      this.set("showSpinner", true);
    }
  },
  actions: {

    submitRequestForSecretKey: function() {
      if (this.get('studentUsername') && this.get('studentNumber')) {
        var self = this;
        this.get("switchLoadingButtons").call(this);

        var userObj = {
          studentNumber: self.get("studentNumber"),
          studentUsername: self.get("studentUsername")
        };
        this.sendAction("submitRequestForSecretKey", userObj, function(result) {
            if (!self.get('checkResponseSuccessful').call(self, result)) {
              var errorMessage = self.get('getErrorString').call(self, result);
              Materialize.toast("<div style='color:red'>Server error: " + errorMessage + "</div>", 3000);
            } else {
              var message = "The secret key was successfully generated and sent to your email: " + result.data.email +
                "@cmail.carleton.ca";
              Materialize.toast(message, 3000);
            }
            self.get("switchLoadingButtons").call(self);
          },
          function() {
            Materialize.toast("<div style='color:red'>Server error while sending results to you.</div>", 3000);
            self.get("switchLoadingButtons").call(self);
          });
      }
    }
  }
});