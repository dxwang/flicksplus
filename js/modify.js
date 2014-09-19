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

	$('<div class="added-description"><div class="nested-div"></div></div>').appendTo('body').css({
		position: "fixed",
		width: "32%",
		top: 0,
		bottom: 0,
		left: 0,
		backgroundImage: "url('http://upload.wikimedia.org/wikipedia/commons/3/30/Cinemaaustralia.jpg')",
		backgroundSize: "cover"
	});

	$('.nested-div').css({
		width: "100%",
		height: "100%",	
		position: "relative",
		backgroundColor: "rgba(0,0,0, 0.75)"
	}).append('<h2 class="opening-title">What would you like to watch today?</h2>');

	var openTitle = $('.opening-title');

	openTitle.css({
		position: "absolute",
		top: "36%",
		color: "rgba(255,255,255, 0.9)",
		fontWeight: "300",
		fontSize: "55px",
		margin: "0 70px",
		fontFamily: "Didot,serif"
	});

	var movieTitle = "This is One of the Movie Titles";
	var directedBy = "Iamadirector Name";
	var firstActor = "Iamthe Firstactor";
	var secondActor = "Iamthe Secondactor";
	var starring = firstActor + ", " + secondActor;
	var yearProduced = "2001";



	$('.boxShot').on('hover', function(){
		openTitle.hide();
		var img = $(this).find('.boxShotImg').clone().addClass("img-injected");
		$(".nested-div").find(".img-injected, .info-blob, .ratings").remove();

		img.appendTo($(".nested-div"));

		$(".nested-div").append("<div class='info-blob'><div class='movie-title'>" + movieTitle + "</div><div class='directed-by'>Director: " + directedBy + "</div><div class='starring'>Starring: " + starring + "</div><div class='year-produced'>" + yearProduced + "</div></div>");

		$('.img-injected').css({
			marginTop: "100px",
			marginLeft: "30px",
			width: "45%",
			float: "left"
		});

		$('.info-blob').css({
			float: "left",
			width: "40%",
			marginTop: "100px",
			marginLeft: "4%",
			color: "rgba(245,245,245, 0.9)",
			marginRight: "3%"
		});

		$('.movie-title').css({
			fontSize: "22px",
			marginBottom: "20px",
			fontWeight: "600"
		});

		$('.directed-by, .starring, .year-produced').css({
			marginBottom: "11px"
		});

		$('<div class="ratings">Ratings<div class="imdb-rating"><span class="imdb-number"></span></div><div class="rt-rating"><span class="rt-number"></span></div><div class="mc-rating"><span class="rt-number"></span></div></div>').appendTo('.nested-div').css({
			clear: "both",
			position: 'absolute',
			top: "420px",
			left: "30px"
		});
	});
})(jQuery);
