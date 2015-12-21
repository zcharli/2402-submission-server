export default {
  name: 'dsa-submission-server',
  after: ['cookie'],
 
  initialize: function(container, app) {
    app.inject('controller', 'cookie', 'cookie:main');
    app.inject('route', 'cookie', 'cookie:main');
  }
};