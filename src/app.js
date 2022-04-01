const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const { runInNewContext } = require("vm");

// To start your app and load changes, run:
//nodemon src/app.js
// Or to look also for changes at hbs files, run:
//nodemon src/app.js -e js,hbs
// Then, navigate to your localhost:3000 to test your app

const app = express(); // variable to store our express application

// Define paths for Express config
const publicDirectoryPath = path.join(__filename, "../../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs"); // using hbs npm module. It's like Handlebars, but more express specific
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Not needed anymore after app.use above introduction
// app.get("", (req, res) => {
//   res.send("<h1>Weather</h1>"); // Test it with localhost:3000
// });

// app.get("/help", (req, res) => {
//   res.send([
//     {
//       name: "Jim",
//     },
//     { name: "Andrew" },
//   ]); // Test it with localhost:3000/help
// });

// app.get("/about", (req, res) => {
//   res.send("<h1>About</h1>");
// });

// Test with localhost:3000
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Jimmy Z",
  });
});

// Test with localhost:3000/about
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Jimmy Z",
  });
});

// Test with localhost:3000/help
app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Jimmy Z",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Jimmy Z",
    errorMessage: "Help article not found",
  });
});
// To create 404 page.
// THIS HAS TO BE LAST IN ORDER
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Jimmy Z",
    errorMessage: "Page not found.",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
