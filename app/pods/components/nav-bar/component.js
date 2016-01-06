import Ember from 'ember';
import SideBarGenerator from '../../../mixins/assignment-list-generator';
export default Ember.Component.extend(SideBarGenerator,{
  tagName: 'div',
  classNames: [],
  userNameSubject: "",
  assignmentObjectArray: [],
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$(".button-collapse").sideNav();
    });
  }.on('didInsertElement'),


  observingUserName: Ember.observer("userNameObserver", function() {
    this.set("userNameSubject", this.get("userNameObserver"));
  }).on('init'),

  assignmentObjectObserver: function() {
    var localStorage = this.get("local-storage"),
      deadlines = localStorage.get("deadlines");
    if (deadlines) {
      this.set("assignmentObjectArray", this.get("generateAssignmentObjectArray").call(this, deadlines));
    }
  }.observes("displayAssignmentObjectArray"),

  actions: {
    logout: function() {
      this.sendAction("action", null);
    }
  }
});