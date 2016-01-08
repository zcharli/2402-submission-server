import Ember from 'ember';
import SideBarGenerator from '../../../mixins/assignment-list-generator';

export default Ember.Component.extend(SideBarGenerator,{
  tagName: 'div',
  classNames: ["your-ranking"],
  assignmentObjectArray: [],

  assignmentObjectObserver: function() {
    var localStorage = this.get("local-storage"),
      deadlines = localStorage.get("deadlines");
    if (deadlines) {
      this.set("assignmentObjectArray", this.get("generateAssignmentObjectArray").call(this, deadlines));
    }
  }.observes("displayAssignmentObjectArray"),

  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
    });
    
  }.on('didInsertElement')
});
