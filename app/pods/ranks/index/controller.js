import Ember from 'ember';
import SideBarGenerator from '../../../mixins/assignment-list-generator';

export default Ember.Controller.extend(SideBarGenerator, {
  // needs: [],
  storage: null,
  assignmentObjectArray: [],
  assignmentRankingObjects: null,

  displayAssignmentObjectArray: Ember.computed("assignmentObjectArray", function(){
    return this.get("assignmentObjectArray");
  }),

  assignmentObjectObserver: function() {
    var localStorage = this.get("storage"),
      deadlines = localStorage.get("deadlines"),
      rankingObjectsToMerge = this.get('assignmentRankingObjects');
    if (deadlines && rankingObjectsToMerge) {
      this.set("assignmentObjectArray", this.get("generateAssignmentObjectArray").call(this, deadlines,rankingObjectsToMerge));
    }
  }.observes("storage.deadlines")
  
});
