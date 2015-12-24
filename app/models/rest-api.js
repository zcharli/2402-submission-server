import Ember from "ember";

export default Ember.Object.extend({
  host: 'http://localhost:3000',
  getHost: function() {
    return this.get('host');
  }
});