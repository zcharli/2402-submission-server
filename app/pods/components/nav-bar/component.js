import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: [],
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$(".button-collapse").sideNav();
    });

  }.on('didInsertElement'),
  userNameSubject: "",
  observingUserName: Ember.observer("userNameObserver", function(){
    console.log(this.get("userNameObserver"));
    this.set("userNameSubject",this.get("userNameObserver"));
  }).on('init'),
  actions: {
    logout: function() {
      this.sendAction("action",null);
    }
  }
});