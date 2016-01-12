import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ["your-ranking-trophy"],

  trophyImageString: "",
  yourRankingString: "",
  cssBackGroundClass: "display-none",

  displayTrophyImage: Ember.computed("trophyImageString", function() {
    return new Ember.Handlebars.SafeString(this.get("trophyImageString"));
  }),
  displayYourRanking: Ember.computed("yourRankingString", function() {
    return this.get("yourRankingString");
  }),
  displayCSSBackGround: Ember.computed("cssBackGroundClass", function() {
    return new Ember.Handlebars.SafeString(this.get("cssBackGroundClass"));
  }),

  init: function() {
    this._super();
    var currentRanking = this.get('ranked'),
      totalStudentsInAssignment = this.get('totalStudentsInRanking'),
      trophyImage = "",
      rankingString = "";
    switch (currentRanking) {
      case 1:
        this.set("cssBackGroundClass", "container-stars");
        trophyImage = "<img src='images/trophy-gold.png' class='responsive-img' alt='You are first in rankings!'/>";
        break;
      case 2:
        this.set("cssBackGroundClass", "bg-4");
        trophyImage = "<img src='images/trophy-silver.png' class='responsive-img' alt='You are second in rankings!'/>";
        break;
      case 3:
        this.set("cssBackGroundClass", "bg-5");
        trophyImage = "<img src='images/trophy-bronze.png' class='responsive-img' alt='You are third in rankings!'/>";
        break;
      default:
        this.set("cssBackGroundClass", "normal");
        break;
    }
    this.set("trophyImageString", trophyImage);
    rankingString = "Congratulations! You are ranked " + currentRanking + " out of " + totalStudentsInAssignment + " students!";
    this.set("yourRankingString", rankingString);
  },
  didInsertElement: function() {
    var self = this;

  }.on('didInsertElement')
});