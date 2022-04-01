const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=0fa804d4de56be7cf28a09867ad324a4&query=" +
    latitude +
    "," +
    longitude;

  // Using property shorthand for url and destructuring for response to get only body
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(
        undefined,
        body.current.weather_descriptions[0] +
          ". It is currently " +
          body.current.temperature +
          " degress out."
      );
    }
  });
};

module.exports = forecast;
