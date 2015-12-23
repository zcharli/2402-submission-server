import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: [],
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$(".button-collapse").sideNav();
    });

  }.on('didInsertElement')
});