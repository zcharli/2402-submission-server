export default {
  name: "injectRestApi",
  initialize: function(container, application) {
    application.inject('adapter', 'rest-api', 'rest-api:main');
    application.inject('controller', 'rest-api', 'rest-api:main');
    application.inject('component', 'rest-api', 'rest-api:main');
    application.inject('route', 'rest-api', 'rest-api:main');

  }
};