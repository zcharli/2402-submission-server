import LocalStorage from '../models/local-storage';

export default{
  name: "registerStorage",
  initialize: function(container, application) {
    application.register('local-storage:main', LocalStorage, {singleton: true});
  }
};