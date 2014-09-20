
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

// Wrapping code in a self-executing function below to enable the private use of the $

(function($){
	$('.connect-overlay.connect').remove();
	$('<div class="added-description"><div class="nested-div"><h2 class="opening-title">What would you like to watch today?</h2></div></div>').appendTo('body');

	var openTitle = $('.opening-title');

	$('.boxShot').on('hover', function(){
		openTitle.hide();

		var img = $(this).find('.boxShotImg').clone().addClass("img-injected");
		$(".nested-div").find(".img-injected, .info-blob, .ratings, .awards").remove();

		img.appendTo($(".nested-div"));
		$(".nested-div").append('<div class="ratings"><div class="imdb-rating"><span class="rate imdb-number">'+ imdbRating +'</span></div><div class="rt-rating"><span class="rate rt-number"><span class="user-base">Critics:</span>'+ rottenCriticRating +'<span class="user-base">Users:</span><span class="second-rating">'+ rottenAudienceRating +'</span></span></div><div class="mc-rating"><span class="rate mc-number"><span class="user-base">Critics:</span> '+ metaCriticRating +'<span class="user-base">User:</span><span class="second-rating">'+ metaUserRating +'</span></span></div></div>');
		$("<div class='info-blob'><div class='movie-title'>" + movieTitle + "</div><div class='directed-by'><span>Director:</span> " + directedBy + "</div><div class='starring'><span>Starring:</span> " + starring + "</div><div class='year-produced'>" + yearProduced + "<span class='duration'>"+ durationOrSeason +"</span><span class='maturity-rating'>" + maturityRating + "</span></div><div class='info-description'>" + infoDescription + " <a class='more-info-link' href='"+ moreInfoLink +"'>More Info</a></div></div>").appendTo('.nested-div');
		$('<div class="awards"></div>').appendTo($(".nested-div"));

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
