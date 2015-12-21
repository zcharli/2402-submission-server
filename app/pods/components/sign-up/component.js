import Ember from 'ember';

export default Ember.Component.extend({
  studentNumber: null,
  studentEmail: null,
  tagName: 'div',
  classNames: ["sign-up-section"],
  didInsertElement: function() {
   
  }.on('didInsertElement'),
  actions: {
    submitRequestForSecretKey: function() {
      if(studentEmail && studentNumbert)
      {
        var self = this;

        var userObj = {
          studentNumber: self.get("studentNumber"),
          studentEmail: self.get("studentEmail")
        };
        
        this.sendAction("submitRequestForSecretKey", userObj);
      }
    }
  }
});