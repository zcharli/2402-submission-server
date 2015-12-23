import RESTApi from "../models/rest-api";

export default {
  name: "registerRestApi",
  initialize: function(container, application) {
    application.register("rest-api:main", RESTApi, {
      singleton: true
    });
  }
};