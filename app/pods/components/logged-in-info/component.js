import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ["logged-in-bar"],
  init: function() {
    this._super();
    // var localStorage = this.get('local-storage');
    // var currentUser = localStorage.get("currentUser");
    // console.log(currentUser);
    // if(currentUser) {
    //   this.set("userName", currentUser.email);
    // }
  },
  userName: "",
  userNameSpectator: Ember.observer("userNameSubject",function(){
    console.log(this.get("userNameSubject"));
    this.set("userName",this.get("userNameSubject"));
  }).on('init'),
  displayLoginUsername: Ember.computed("userName", function() {
    return this.get("userName");
  }),
  displayLogout: Ember.computed("userName",function(){
    var showLogout = this.get('userName');
    if (showLogout !== "") {
      return new Ember.Handlebars.SafeString("display: block");
    } else {
      return new Ember.Handlebars.SafeString("display: none");
    }
  }),
  displayLogin: Ember.computed("userName",function(){
    var showLogout = this.get('userName');
    if (showLogout === "") {
      return new Ember.Handlebars.SafeString("display: block");
    } else {
      return new Ember.Handlebars.SafeString("display: none");
    }
  }),
  // didInsertElement: function() {
  //  
  // }.on('didInsertElement')
  actions: {
    logout: function() {
      console.log("Logged in info");
      this.sendAction("action",null);
    }
  }
});
