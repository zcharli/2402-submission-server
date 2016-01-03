import Ember from 'ember';

export default Ember.Mixin.create({
  getErrorString: function(response) {
    var retString = "";
    var errorResponseCode = 0;
    if (response.responseType === "error") {
      errorResponseCode = response.responseCode;
    }
    switch (errorResponseCode) {
      case 1001:
        retString = "No Email provided";
        break;
      case 1002:
        retString = "Invalid Student Number provided";
        break;
      case 1003:
        retString = "Database Error";
        break;
      case 1004:
        retString = "Unable to Send Email to User";
        break;
      case 1005:
        retString = "No secret key provided";
        break;
      case 1006:
        retString = "Secret key does not match any of the valid keys";
        break;
      case 1007:
        retString = "No submission file received";
        break;
      case 1008:
        retString = "Unable to find mark for student";
        break;
      case 1009:
        retString = "Marking Error";
        break;
      case 1010:
        retString = "Deadline has passed";
        break;
      default:
        retString = "No error code found";
        break;
    }
    return retString;
  },
  checkResponseSuccessful: function(response) {
    if (response.responseType === "error") {
      return false;
    }
    return true;
  }
});