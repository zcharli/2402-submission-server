import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('ranks', function() {});
  this.route('submission', function() {
    this.route('assignment', {path:'assignment/:assignmentNumber'}, function() {
      
    });
    this.route('error');
  });
  this.route('account', function() {
    this.route('new');
  });
  this.route('e');
});

export default Router;
