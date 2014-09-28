
// dxwang -- Please replace these placeholder values with dynamically udpated ones from Netflix and other sources

var movieTitle = "This is One of the Movie Titles";
var directedBy = "Iamadirector Name";
var firstActor = "Iamthe Firstactor";
var secondActor = "Iamthe Secondactor";
var starring = firstActor + ", " + secondActor;
var yearProduced = "2001";
var durationOrSeason = "120 min";
var maturityRating = "TV-MA";

var numOscars = 2;
var numGoldens = 2;
var numEmmys = 2;

var imdbRating = "79";
var rottenCriticRating = "72";
var rottenAudienceRating = "90";
var metaCriticRating = "62";
var metaUserRating = "94";
var infoDescription = "When his manic radio show proves a morale-booster, an Armed Forces Radio DJ gets sent to Vietnam, where his act lands him in trouble with superiors.";
var moreInfoLink = "#";

var myListLink = "#";
var recommendLink = "#";

// Wrapping code in a self-executing function below to enable the private use of the $

(function($){
	$('.connect-overlay.connect').remove();
	$('<div class="added-description"><div class="nested-div"><h2 class="opening-title">What would you like to watch today?</h2></div></div>').appendTo('body');

	var openTitle = $('.opening-title');

	$('.boxShot').on('hover', function(){
		var getTextFromObject = function(object) {
			return object
				.clone() // Clone the element.
				.children() // Select the children.
				.remove() // Remove the children.
				.end() // Go back to the selected element.
				.text() // Get the text of the element.
				.trim(); // Trim the whitespace from the text
		}

		setTimeout(function() {
			var infoObj = $('#BobMovie-content');
			var movieTitle = getTextFromObject(infoObj.find('.title'));
			var yearProduced = getTextFromObject(infoObj.find('.year'));
			var duration = getTextFromObject(infoObj.find('.duration'));
			console.log(movieTitle);
			console.log(yearProduced);
			console.log(duration);
			var infoDescription = getTextFromObject(infoObj.find('.bobMovieContent'));
			var actors = "";
			var creators = "";
			var imdbRating = "79";
			var rottenCriticRating = "72";
			var rottenAudienceRating = "90";
			var metaCriticRating = "62";
			var metaUserRating = "94";

			// var omdbRequestUrl = 'http://www.omdbapi.com/?t=' + movieTitle;
			// var rtRequestUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=u4f7ar7byc87wg3qxs9u8ecm&q=' 
			// + movieTitle
			// + '&page_limit=1';
			// jQuery.ajax({
			// 	type: "GET", 
			// 	url: omdbRequestUrl, 
			// 	dataType: 'jsonp', 
			// 	success: function(data){
			// 		imdbRating = data.imdbRating;
			// 		metaCriticRating = data.Metascore;
			// 	}
			// });

			var numOscars = 2;
			var numGoldens = 2;
			var numEmmys = 2;

			openTitle.hide();

		var img = $(this).find('.boxShotImg').clone().addClass("img-injected");
		$(".nested-div").find(".img-injected, .info-blob, .ratings, .my-options, .awards").remove();

		img.appendTo($(".nested-div"));
		$(".nested-div").append('<div class="ratings"><div class="imdb-rating"><span class="rate imdb-number">'+ imdbRating +'</span></div><div class="rt-rating"><span class="rate rt-number"><span class="user-base">Critics:</span>'+ rottenCriticRating +'<span class="user-base">Users:</span><span class="second-rating">'+ rottenAudienceRating +'</span></span></div><div class="mc-rating"><span class="rate mc-number"><span class="user-base">Critics:</span> '+ metaCriticRating +'<span class="user-base">User:</span><span class="second-rating">'+ metaUserRating +'</span></span></div></div>');
		$("<div class='info-blob'><div class='movie-title'>" + movieTitle + "</div><div class='directed-by'><span>Director:</span> " + directedBy + "</div><div class='starring'><span>Starring:</span> " + starring + "</div><div class='year-produced'>" + yearProduced + "<span class='duration'>"+ durationOrSeason +"</span><span class='maturity-rating'>" + maturityRating + "</span></div><div class='info-description'>" + infoDescription + " <a class='more-info-link' href='"+ moreInfoLink +"'>More Info</a></div></div>").appendTo('.nested-div');
		$('<div class="awards"></div>').appendTo($(".nested-div"));
		$('<div class="my-options"><a class="new-my-list" href="'+myListLink+'">My List</a><a class="new-recommend" href="'+recommendLink+'">Recommend</a></div>').appendTo('.nested-div');

		for (i=0; i<numOscars; i++){
			$('<span class="oscar award-icon"></span>').appendTo($('.awards'));
		}
		for (i=0; i<numGoldens; i++){
			$('<span class="golden award-icon"></span>').appendTo($('.awards'));
		}
		for (i=0; i<numEmmys; i++){
			$('<span class="emmy award-icon"></span>').appendTo($('.awards'));
		}
	});
})(jQuery);
