import Ember from 'ember';

export default Ember.Controller.extend({
  assignmentNumber: Ember.computed("model", function() {
    return this.get('model')["assignmentNumber"];
  }),
  // needs: [],
});
