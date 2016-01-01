import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ["spinner-button"],
  showButton: true,
  showSpinner: false,
  submitButtonText: "",
  loadingSubject: false,

  init: function() {
    this._super();
    this.set("submitButtonText", this.get("text"));
  },

  toggleSpinnerSubject: Ember.observer("loadingSubject", function() {
    this.set("showSpinner", this.get("loadingSubject"));
    this.get("switchLoadingButtons").call(this);
  }).on('init'),

  displayButtonText: Ember.computed("submitButtonText", function() {
    return this.get("submitButtonText");
  }),
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
  switchLoadingButtons: function() {
    var isSpinning = this.get("showSpinner");
    if (!isSpinning) {
      this.set("showButton", true);
      this.set("showSpinner", false);
    } else {
      this.set("showButton", false);
      this.set("showSpinner", true);
    }
  },

  // didInsertElement: function() {
  //  
  // }.on('didInsertElement')

  actions: {
    clicked: function() {
      this.sendAction("action");
    }
  }
});