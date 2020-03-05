require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
const axios = require('axios');
var moment = require('moment');
moment().format();
var fs = require('fs');


var command = process.argv[2];
var searchTerm = process.argv.slice(3).join(" ").trim();

console.log(command);
console.log(searchTerm);

UserInput(command, searchTerm);

function UserInput(command, searchTerm) {
  switch (command) {
    case "spotify-this-song":
      spotifySong(searchTerm);
      break;
    case "concert-this":
      concertThis(searchTerm);
      break;
    case "movie-this":
      movieThis(searchTerm);
      break;
    case "do-what-it-says":
      doWhatItDo();
  }
}

function spotifySong(searchTerm) {
  if (!searchTerm) {
    searchTerm = "The Sign";
  }

  spotify
    .search({
      type: 'track',
      query: searchTerm
    })
    .then(function (response) {
      for (var i = 0; i < 5; i++) {
        var spotifyResults =
          "--------------------------------------------------------------------" +
          "\nArtist(s): " + response.tracks.items[i].artists[0].name +
          "\nSong Name: " + response.tracks.items[i].name +
          "\nAlbum Name: " + response.tracks.items[i].album.name +
          "\nPreview Link: " + response.tracks.items[i].preview_url;

        console.log(spotifyResults);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

function concertThis(searchTerm) {
  // Make a request for a user with a given ID
  axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp")
    .then(function (response) {
      // handle success
      for (var i = 0; i < response.data.length; i++) {
        var datetime = response.data[i].datetime;
        var dateArr = datetime.split("T");

        var concertResults =
          "--------------------------------------------------------------------" +
          "\nVenue Name: " + response.data[i].venue.name +
          "\nVenue Location: " + response.data[i].venue.city +
          "\nDate of the Event: " + moment(dateArr[0], "MM-DD-YYYY"); //dateArr[0] should be the date separated from the time
        console.log(concertResults);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}

function movieThis(searchTerm) {
  if (!searchTerm) {
    searchTerm = "mr nobody";
  }
  axios.get("https://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy")
    .then(function (response) {
      var movieResults =
        "--------------------------------------------------------------------" +
        "\nMovie Title: " + response.data.Title +
        "\nYear of Release " + response.data.Year +
        "\nIMDB Rating: " + response.data.imdbRating +
        "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
        "\nCountry Produced: " + response.data.Country +
        "\nLanguage: " + response.data.Language +
        "\nPlot: " + response.data.Plot +
        "\nActors/Actresses: " + response.data.Actors;
      console.log(movieResults);
    })
    .catch(function (error) {
      console.log(error);
    })
}

function doWhatItDo() {
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var dataArr = data.split(',');
    UserInputs(dataArr[0], dataArr[1]);
  });
}