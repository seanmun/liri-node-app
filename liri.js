require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var search = process.argv[2];
var term = process.argv.slice(3).join(" ");
var divider = "\n------------------------------------------------------------\n\n";

switch (search) {
	case "concert-this":
    concert(term);
	break;

	case "spotify-this-song":
	spotify(term);
	break;

	case "movie-this":
	movie(term);
	break;

	case "do-what-it-says":
	doit();
	break;
};

function concert(term) {
	var queryUrl = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";
	request(queryUrl, function(error, response, body) {
		if (!term){term = 'Roots';}
		if (!error && response.statusCode === 200) {
            var concertResponse = JSON.parse(body)[0];
            var concertData = [
                "Artist: " + term,
                "Venue: " + concertResponse.venue.name,
                "Location: " + concertResponse.venue.city,
                "Date: " + concertResponse.datetime
              ].join("\n\n");
              console.log(concertData);
              fs.appendFile("log.txt", concertData + divider, function(err) {
                if (err) throw err;
              });
		}
	});
};

function spotify(term) {
	var spotify = new Spotify(keys.spotify); 
		if (!term){term = 'The Sign';}
		spotify.search({ type: 'track', query: term }, function(err, data) {
		if (err){ console.log('Error occurred: ' + err);return;}
            var songResponse = data.tracks.items;
            var songData = [
                "Artist: " + songResponse[0].artists[0].name,
                "Song Name: " + songResponse[0].name,
                "Preview Link: " + songResponse[0].preview_url,
                "Album: " + songResponse[0].album.name
              ].join("\n\n");
              console.log(songData);
              fs.appendFile("log.txt", songData + divider, function(err) {
                if (err) throw err;
              });
    });
    
};

function movie(term) {
	var queryUrl = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(error, response, body) {
		if (!term){term = 'Mr Nobody';}
		if (!error && response.statusCode === 200) {
            var movieResponse = JSON.parse(body);
            var movieData = [
                "Title: " + movieResponse.Title,
                "Release Year: " + movieResponse.Year,
                "IMDB Rating: " + movieResponse.imdbRating,
                "Rotten Tomatoes Rating: " + movieResponse.Ratings[1].Value,
                "Country: " + movieResponse.Country,
                "Language: " + movieResponse.Language,
                "Plot: " + movieResponse.Plot,
                "Actors: " + movieResponse.Actors
              ].join("\n\n");
              console.log(movieData);
        }
        fs.appendFile("log.txt", movieData + divider, function(err) {
            if (err) throw err;
           
          });
    });
    
};