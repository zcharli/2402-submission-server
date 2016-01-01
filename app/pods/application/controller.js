import Ember from 'ember';

export default Ember.Controller.extend({
  // needs: [],
  userLoggedIn: "",
  initApplication: function() {
    var cookie = this.get("cookie");
    var token = cookie.getCookie('secretKey');
    var loggedIn = true;
    var localStorage = this.get("local-storage");

    if (!token) {
      console.log("Token Missing from assignment route");
      loggedIn = false;
      localStorage.delete("currentUser");
      return;
    }

    var currentUser = localStorage.get("currentUser");
    if (currentUser && loggedIn) {
      this.set('userLoggedIn', currentUser.email);
    } else {
      cookie.setCookie("secretKey", "", {
        expires: 1
      });
    }
  }.on('init'),
  actions: {
    logoutUserFromApp: function() {
      var cookies = this.get("cookie");
      cookies.setCookie("secretKey", "", {
        expires: 1
      });
      var localStorage = this.get("local-storage");
      localStorage.delete("currentUser");
      this.set('userLoggedIn', "");
      this.transitionToRoute("application");
    }
  }
});