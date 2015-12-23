import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ["ranking-tabs"],
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$("ul.ranking-tabs-display").tabs();
    });

  }.on('didInsertElement')
});
