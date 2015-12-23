import Ember from "ember";

export default Ember.Object.extend({
  // localstorage can onyl store strings but we can get around that by 
  // stringify any js data structure and then parse it after
  // Do not try to put everything into local storage, it has a 5MB limit
  exists: function(key) {
    if (!Ember.isNone(key) && !Ember.isNone(localStorage[key])) {
      return true;
    }
    return false;
  },
  get: function(key) {
    // gets the value of a key
    if (!Ember.isNone(key) && !Ember.isNone(localStorage[key])) {
      return JSON.parse(localStorage[key]);
    }
    return undefined;
  },
  add: function(key, value) {
    if (!Ember.isNone(key) && !Ember.isNone(value)) {
      localStorage[key] = JSON.stringify(value);
    }
  },
  update: function(key, value) {
    if (!Ember.isNone(key) && !Ember.isNone(localStorage[key]) && !Ember.isNone(value)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    //this.notifyPropertyChange(key);
  },
  delete: function(key) {
    if (!Ember.isNone(key)) {
      localStorage.removeItem(key);
    }
  },
  getLocalStorageSize: function() {
    var allStrings = '';
    for (var key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        allStrings += localStorage[key];
      }
    }
    return allStrings ? 3 + ((allStrings.length * 16) / (8 * 1024)) + ' KB' : 'Empty (0 KB)';
  },
  print: function() {
    // prints the contents of storage
    console.log("Printing contents of the storage");
    for (var key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        console.log(key + ": " + localStorage[key]);
      }
    }
    return "Print complete";
  },
  clearStorage: function() {
    // pseudo implementation
    localStorage.clear();
  }
});