import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ["your-ranking-trophy"],

  trophyImageString:"",
  yourRankingString: "",

  displayTrophyImage: Ember.computed("trophyImageString", function() {
    return new Ember.Handlebars.SafeString(this.get("trophyImageString"));
  }),
  displayYourRanking: Ember.computed("yourRankingString", function() {
    return this.get("yourRankingString");
  }),

  init:function(){
    this._super();
    console.log("HI");
    var currentRanking = this.get('ranked'),
        totalStudentsInAssignment = this.get('totalStudentsInRanking'),
        trophyImage = "",
        rankingString = "";
    switch(currentRanking) {
      case 1:
        trophyImage = "<img src='images/trophy-gold.jpg' class='responsive-img' alt='You are first in rankings!'/>";
        break;
      case 2:
        trophyImage = "<img src='images/trophy-silver.jpg' class='responsive-img' alt='You are second in rankings!'/>";
        break;
      case 3:
        trophyImage = "<img src='images/trophy-bronze.jpg' class='responsive-img' alt='You are third in rankings!'/>";
        break;
      default:
        break;
    }
    this.set("trophyImageString", trophyImage);
    rankingString = "Congratulations! You are ranked " + currentRanking + " out of " + totalStudentsInAssignment + " students!";
    this.set("yourRankingString", rankingString);
  }
  // didInsertElement: function() {
  //  
  // }.on('didInsertElement')
});
