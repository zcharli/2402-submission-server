import Ember from 'ember';

export default Ember.Mixin.create({
  htmlEntities: function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/"/g, '&quot;');
  }
});