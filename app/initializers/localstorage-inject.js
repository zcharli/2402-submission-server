export default {
  name: "injectStorage",
  initialize: function(container, application) {
    application.inject('controller', 'local-storage', 'local-storage:main');
    application.inject('route', 'local-storage', 'local-storage:main');
    // application.inject('component', 'local-storage', 'local-storage:main');
    // application.inject('model', 'local-storage', 'local-storage:main');
  }
};