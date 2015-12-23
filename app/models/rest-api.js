import Ember from "ember";

export default Ember.Object.extend({
  host: 'http://dabbyndubisi.me:2000',
  getHost: function() {
    return this.get('host');
  }
});
