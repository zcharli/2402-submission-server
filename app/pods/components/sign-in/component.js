import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['sign-in-section'],
  userInputedSecretKey: null,
  onPageLoad: function() {

  }.on('didInsertElement'),
  actions: {
    submitSecretKey: function() {
      // Sends the controller who owns this component the secret key
      var secretKey = this.get('userInputedSecretKey');

      // Controller must send over action key submitSecretKey
      if (secretKey) {

        // Ajax this call to verify key
        this.sendAction('submitSecretKey', secretKey.trim());
      } else {
        this.send("submitWrongSecretKey");
      }
    },
    submitWrongSecretKey: function() {
      Ember.$("#input-secret-key").addClass("invalid");

      /* jshint ignore:start */
      Materialize.toast("<div style='color:red'><i class='material-icons left'>error_outline</i> The key you entered was invalid!</div>", 3000);
      /* jshint ignore:end */
    }
  }
});