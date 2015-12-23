import Ember from 'ember';

export default Ember.Component.extend({
  studentNumber: null,
  studentUsername: null,
  tagName: 'div',
  classNames: ["sign-up-section"],
  didInsertElement: function() {

  }.on('didInsertElement'),
  actions: {
    submitRequestForSecretKey: function() {
      if (this.get('studentUsername') && this.get('studentNumber')) {
        var self = this;

        var userObj = {
          studentNumber: self.get("studentNumber"),
          studentUsername: self.get("studentUsername")
        };

        this.sendAction("submitRequestForSecretKey", userObj);
      }
    }
  }
});