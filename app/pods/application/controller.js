import Ember from 'ember';

export default Ember.Controller.extend({
  // needs: [],
  userLoggedIn: "",
  initApplication:function(){
  	var localStorage = this.get("local-storage");
    var currentUser = localStorage.get("currentUser");
    if(currentUser) {
      console.log("Set logged in user");
      this.set('userLoggedIn',currentUser.email);
    }
  }.on('init'),
  actions: {
    logoutUserFromApp: function() {
      var cookies = this.get("cookie");
      cookies.setCookie("secretKey", "", {expires: 1});
      var localStorage = this.get("local-storage");
      localStorage.delete("currentUser");
      this.set('userLoggedIn', "");
      this.transitionToRoute("application");
    }
  }
});
