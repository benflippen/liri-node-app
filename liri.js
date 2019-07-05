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
      showMovieInfo(searchTerm);
      break;
    case "do-what-it-says":
      doWhatItDo();
  }
}

function spotifySong(searchTerm) {
  if (!searchTerm) {
    value = "The Sign";
  }

  spotify
  .search({ type: 'track', query: searchTerm })
  .then(function(response) {
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
  .catch(function(err) {
      console.log(err);
  });
}

function concertThis(searchTerm){
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