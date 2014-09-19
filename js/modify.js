
// dxwang -- Please replace these placeholder values with dynamically udpated ones from Netflix and other sources

var movieTitle = "This is One of the Movie Titles";
var directedBy = "Iamadirector Name";
var firstActor = "Iamthe Firstactor";
var secondActor = "Iamthe Secondactor";
var starring = firstActor + ", " + secondActor;
var yearProduced = "2001";

var numOscars = 2;
var numGoldens = 2;
var numEmmys = 2;

var imdbRating = "79%";
var rottenCriticRating = "72%";
var rottenAudienceRating = "90%";
var metaCriticRating = "62";
var metaUserRating = "9.4";



// Wrapping code in a self-executing function below to enable the private use of the $

(function($){
	$('.connect-overlay.connect').remove();

	$('#hd').css({
		height: '75px',
		marginTop: "-12px",
		zIndex: 100
	});

	$('#footer').css({
		clear: "both",
		float: "right",
		width: "65%"
	});

	$('.main-content').css({
		width: '65%',
		float: 'right',
	});

	$('<div class="added-description"><div class="nested-div"><h2 class="opening-title">What would you like to watch today?</h2></div></div>').appendTo('body');

	var openTitle = $('.opening-title');

	$('.boxShot').on('hover', function(){
		openTitle.hide();

		var img = $(this).find('.boxShotImg').clone().addClass("img-injected");
		$(".nested-div").find(".img-injected, .info-blob, .ratings").remove();

		img.appendTo($(".nested-div"));
		$(".nested-div").append("<div class='info-blob'><div class='movie-title'>" + movieTitle + "</div><div class='directed-by'>Director: " + directedBy + "</div><div class='starring'>Starring: " + starring + "</div><div class='year-produced'>" + yearProduced + "</div></div>");
		$('<div class="ratings"><div class="imdb-rating"><span class="rate imdb-number"></span></div><div class="rt-rating"><span class="rate rt-number"></span></div><div class="mc-rating"><span class="rate mc-number"></span></div></div>').appendTo('.nested-div');
	});


})(jQuery);
