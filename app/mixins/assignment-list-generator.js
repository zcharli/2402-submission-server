import Ember from 'ember';

export default Ember.Mixin.create({
  generateAssignmentObjectArray: function(assignObjects, optionalObjectAttributes) {
    var assignObjectsArray = [];
    for(var key in assignObjects) {
      if(assignObjects.hasOwnProperty(key)) {
        var currAssignment = assignObjects[key];
        var assignment = {
          route: currAssignment.routeParam,
          id: key,
          title: currAssignment.title
        };
        if(optionalObjectAttributes) {
          Object.assign(assignment, optionalObjectAttributes[key]);
        }

        assignObjectsArray.push(assignment);
      }
    }
    return assignObjectsArray;
  }
});
