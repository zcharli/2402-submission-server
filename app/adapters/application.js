import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: function() {
    return this.get('rest-api').getHost();
  },
  buildURL: function(type, id) {
    console.log("buildURL(" + type + "," + id + ")");
  }

});