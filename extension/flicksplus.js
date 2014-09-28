function flicksplus() {
    var flicksplus = this;
    this.omdbReq = null;
    this.rtReq = null;
    this.metaReq = null;
    this.notAvailable = '<div class="not-available">N/A</div>';

    this.checkName = function(name1, name2) {
        return name1 && name2 && (name1.toUpperCase().indexOf(name2.toUpperCase()) > -1 ||
            name2.toUpperCase().indexOf(name1.toUpperCase()) > -1);
    }

    this.insertAwesome = function() {
        $('.connect-overlay.connect').remove();
        $('<div class="added-description"><div class="nested-div"><h2 class="opening-title">What would you like to watch today?</h2></div></div>').appendTo('body');
    
        this.attachMouseOverHandler();
    }

    this.attachMouseOverHandler = function(){
        $(document).on('mouseover', '.boxShot', this.mouseOverHandler.bind(this));
    }

    this.cancelCurrentRequests = function() {
        if (this.omdbReq) {
            this.omdbReq.abort();
        }
        if (this.rtReq) {
            this.rtReq.abort();
        }
        if (this.metaReq) {
            this.metaReq.abort();
        }
    }

    this.mouseOverHandler = function(e) {
        this.cancelCurrentRequests();
        $('.opening-title').hide();

        var img = $(e.target).parent().find('.boxShotImg').clone().addClass("img-injected");
        this.movieName = $(e.target).parent().find('.boxShotImg').attr('alt');
        $(".nested-div").find(".img-injected, .info-blob, .ratings, .my-options, .awards").remove();
        img.appendTo($(".nested-div"));

        $('.nested-div').append(
            '<div class="ratings"></div>' +
            '<div class="awards"></div>' +
            '<div class="info-blob"></div>' + 
            '<div class="my-options"></div>');

        $('#BobMovie').remove();

        this.getMovieInfo(this.movieName);
    }

    this.getMovieInfo = function(movieName) {
        var omdbRequestUrl = 'http://www.omdbapi.com/?t=' + movieName;
        this.omdbReq = $.ajax({
            type: "GET", 
            url: omdbRequestUrl, 
            dataType: 'json', 
            success: function(movieInfo){
                if (flicksplus.checkName(movieInfo.Title, flicksplus.movieName)) {
                    movieInfo['imdbRating'] = movieInfo['imdbRating'] || flicksplus.notAvailable;
                    movieInfo['Metascore'] = movieInfo['Metascore'] || flicksplus.notAvailable;
                    if (movieInfo['imdbRating'] === 'N/A') {
                        movieInfo['imdbRating'] = flicksplus.notAvailable;
                    }
                    if (movieInfo['Metascore'] === 'N/A') {
                        movieInfo['Metascore'] = flicksplus.notAvailable;
                    }
                    flicksplus.displayAwardData(movieInfo['Awards']);
                    flicksplus.injectMovieData(movieInfo);
                    flicksplus.injectRatingsData(movieInfo);
                    flicksplus.getRTInfo(movieInfo);
                } 
            }
        });
    }

    this.displayAwardData = function(awardString) {
        var movieData = {};
        var oscarInString = awardString.split(' Oscar');
        var goldenInString = awardString.split(' Golden');
        var emmyInString = awardString.split(' Emmy');
        if (oscarInString.length > 1) {
            movieData['numOscars'] = parseInt(oscarInString[0].split(' ')[1]);
        }
        if (goldenInString.length > 1) {
            movieData['numGoldens'] = parseInt(goldenInString[0].split(' ')[1]);
        }
        if (emmyInString.length > 1) {
            movieData['numEmmys'] = parseInt(emmyInString[0].split(' ')[1]);
        }
        this.injectAwardsData(movieData);
    }

    this.getRTInfo = function(movieData) {
        var rtRequestUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=u4f7ar7byc87wg3qxs9u8ecm&q=' + encodeURIComponent(movieData.Title + ' ' + movieData.Year);
        this.rtReq = $.ajax({
            type: "GET",
            url: rtRequestUrl,
            dataType: 'json',
            success: function(RTInfo) {
                var infoObj = RTInfo.movies[0] || {};
                if (flicksplus.checkName(movieData.Title, flicksplus.movieName)) {
                    var ratings = infoObj.ratings || {};
                    movieData['rtCriticsScore'] = ((ratings.critics_score > 0) ? ratings.critics_score : flicksplus.notAvailable);
                    movieData['rtAudienceScore'] = ((ratings.audience_score > 0) ? ratings.audience_score : flicksplus.notAvailable);
                    flicksplus.injectRatingsData(movieData);
                    flicksplus.getMetaInfo(movieData);
                }
            }
        });
    }

    this.getMetaInfo = function(movieData) {
        var metaRequestUrl = 'https://byroredux-metacritic.p.mashape.com/find/movie';
        this.metaReq = $.ajax({
            type: 'POST',
            url: metaRequestUrl,
            dataType: 'json',
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("X-Mashape-Key","jgckKjdLmSmsheiVNN5ZzPM8PrGkp1zLZFmjsn8ZS3oEovu9S0");
            },
            data: {
                'title': movieData.Title
            },
            success: function(metaInfo) {
                var infoObj = (metaInfo.result || {});
                if (flicksplus.checkName(movieData.Title, flicksplus.movieName)) {
                    movieData['metascore'] = infoObj.score || flicksplus.notAvailable;
                    movieData['metaUserScore'] = infoObj.userscore || flicksplus.notAvailable;
                    flicksplus.injectRatingsData(movieData);
                }
            }

        });        
    }

    this.injectMovieData = function(info) {
        $('.info-blob').html(
            "<div class='movie-title'>" + 
                (info.Title || 'N/A') + 
            "</div>" +
            "<div class='directed-by'>" +
                "<span>Director: </span>" + 
                (info.Director || 'N/A') + 
            "</div>" +
            "<div class='starring'>" +
                "<span>Starring: </span>" + 
                (info.Actors || 'N/A') + 
            "</div>" +
            "<div class='year-produced'>" + 
                (info.Year || 'N/A') + 
                "<span class='duration'>" + 
                    (info.Runtime || 'N/A') +
                "</span>" + 
                "<span class='maturity-rating'>" + 
                    (info.Rated || 'N/A') + 
                "</span>" + 
            "</div>" + 
            "<div class='info-description'>" + 
                (info.Plot  || 'N/A') + " " +
                "<a class='more-info-link' href='" + info.moreInfoLink +"'>" +
                    "More Info" +
                "</a>" +
            "</div>"
        );
    }

    this.injectOptionsData = function(info) {
        $('.my-options').html(
            '<a class="new-my-list" href="' + info.myListLink + '">' +
                'My List' +
            '</a>' + 
            '<a class="new-recommend" href="' + info.recommendLink + '">' +
                'Recommend' +
            '</a>'
        );
    }

    this.injectRatingsData = function(info) {
        $('.ratings').html(
            '<div class="imdb-rating">' + 
                '<span class="rate imdb-number">' + 
                    (info.imdbRating || '<div class="loading-score"></div>') +
                '</span>' + 
            '</div>' +
            '<div class="rt-rating">' + 
                '<span class="rate rt-number">' + 
                    '<span class="user-base">Critics:</span> '+ 
                    (info.rtCriticsScore || '<div class="loading-score"></div>') +
                    '<span class="user-base">Users:</span>' + 
                    '<span class="second-rating">' + 
                        (info.rtAudienceScore || '<div class="loading-score"></div>') +
                    '</span>' + 
                '</span>' + 
            '</div>' + 
            '<div class="mc-rating">' + 
                '<span class="rate mc-number">' +
                    '<span class="user-base">Critics:</span>'+ 
                        (info.Metascore || '<div class="loading-score"></div>') +
                    '<span class="user-base">User:</span>' +
                    '<span class="second-rating">' + 
                        (info.metaUserScore  || '<div class="loading-score"></div>') +
                    '</span>' +
                '</span>' +
            '</div>'
        );
    }

    this.injectAwardsData = function(info) {
        var awardsContainer = '';
        for (i=0; i<info.numOscars; i++){
            awardsContainer += '<span class="oscar award-icon"></span>';
        }
        for (i=0; i<info.numGoldens; i++){
            awardsContainer += '<span class="golden award-icon"></span>';
        }
        for (i=0; i<info.numEmmys; i++){
            awardsContainer += '<span class="emmy award-icon"></span>';
        }
        $('.awards').html(awardsContainer);
    }
};

var showRunner = new flicksplus();
showRunner.insertAwesome();
