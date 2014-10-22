var showRunner = new cineplusController();
showRunner.start();

function cineplusModel() {
    var cineplusModel = this;
    this.data = {};
    this.notAvailable = '<div class="not-available">N/A</div>';

    this.getMovieInfo = function(movieName, callback) {
        if (this.data[movieName]) {
            callback(this.data[movieName]);
        } else {
            this.data[movieName] = {
                'Title': movieName
            };
            this.getOmdbInfo_(this.data[movieName], callback);
            callback(this.data[movieName]);
        }
    };

    this.formatAwardData_ = function(movieData) {
        var awardData = {};
        var awardString = movieData.Awards;
        var oscarInString = awardString.split(' Oscar');
        var goldenInString = awardString.split(' Golden');
        var emmyInString = awardString.split(' Emmy');
        if (oscarInString.length > 1) {
            awardData['numOscars'] = parseInt(oscarInString[0].split(' ')[1]);
        }
        if (goldenInString.length > 1) {
            awardData['numGoldens'] = parseInt(goldenInString[0].split(' ')[1]);
        }
        if (emmyInString.length > 1) {
            awardData['numEmmys'] = parseInt(emmyInString[0].split(' ')[1]);
        }
        movieData['awardData'] = awardData;
    };

    this.getOmdbInfo_ = function(movieData, callback) {
        var omdbRequestUrl = 'http://cineplus.co:8001/?site=OMDB&title=' + movieData.Title;
        $.ajax({
            type: "GET", 
            url: omdbRequestUrl, 
            dataType: 'json', 
            success: function(movieInfo){
                $.extend(movieData, movieInfo);
                movieData['imdbRating'] = movieInfo['imdbRating'] || cineplusModel.notAvailable;
                movieData['Metascore'] = movieInfo['Metascore'] || cineplusModel.notAvailable;
                movieData['Awards'] = movieInfo['Awards'] || '';
                if (movieInfo['imdbRating'] === 'N/A') {
                    movieData['imdbRating'] = cineplusModel.notAvailable;
                }
                if (movieInfo['Metascore'] === 'N/A') {
                    movieData['Metascore'] = cineplusModel.notAvailable;
                }
                cineplusModel.formatAwardData_(movieData);
                cineplusModel.getRTInfo_(movieData, callback);
            },
            complete: function() {
                callback(movieData);
            }
        });
    };

    this.getRTInfo_ = function(movieData, callback) {
        var rtRequestUrl = 'http://cineplus.co:8001/?site=RT&title=' + encodeURIComponent(movieData.Title + ' ' + movieData.Year);
        $.ajax({
            type: "GET",
            url: rtRequestUrl,
            dataType: 'json',
            success: function(RTInfo) {
                var infoObj = RTInfo.movies[0] || {};
                var ratings = infoObj.ratings || {};
                movieData['rtCriticsScore'] = ((ratings.critics_score > 0) ? ratings.critics_score : cineplusModel.notAvailable);
                movieData['rtAudienceScore'] = ((ratings.audience_score > 0) ? ratings.audience_score : cineplusModel.notAvailable);
            },
            complete: function() {
                callback(movieData);
            }
        });
    };
};


function cineplusView() {
    this.movieName = '';
    $('.connect-overlay.connect').remove();
    $('<div class="added-description"><div class="nested-div"><h2 class="opening-title">What would you like to watch today?</h2></div></div>').appendTo('body');

    this.reset = function(element) {
        $('.opening-title').hide();
        var infoPane = $('.nested-div');
        var img = element.clone().addClass("img-injected");
        infoPane.find(".img-injected, .info-blob, .ratings, .my-options, .awards").remove();
        infoPane.append(img);
        infoPane.append([
            '<div class="ratings"></div>',
            '<div class="awards"></div>',
            '<div class="info-blob"></div>'
        ].join(''));
        $('#BobMovie, #bob-container').remove();
    };

    this.setMovieName = function(movieName) {
        this.movieName = movieName;
    }

    this.addMoreInfoButton = function(element, movieId) {
        element.find('.more-info-link').remove();
        element.append('<a class="more-info-link" href="http://www.netflix.com/WiMovie/' + movieId + '">More Info</a>');
    };

    this.hideMoreInfoButton = function() {
        $('.more-info-link').hide();
    };

    this.displayMovieData = function(movieData) {
        console.log(this.movieName + ' ' + movieData.Title);
        if (this.isSameMovie_(movieData.Title, this.movieName)) {
            this.displayOmdbData_(movieData);
            this.displayRatingsData_(movieData);
            this.displayAwardsData_(movieData['awardData'] || {});
        }
    };

    this.isSameMovie_ = function(name1, name2) {
        if (name1 && name2) {
            name1 = name1.replace(':', '');
            name2 = name2.replace(':', '');
        }
        return name1 && name2 && (name1.toUpperCase().indexOf(name2.toUpperCase()) > -1 ||
            name2.toUpperCase().indexOf(name1.toUpperCase()) > -1);
    };

    this.displayOmdbData_ = function(info) {
        $('.info-blob').html([
            "<div class='movie-title'>", 
                (info.Title || 'N/A'),
            "</div>",
            "<div class='directed-by'>",
                "<span>Director: </span>", 
                (info.Director || 'N/A'), 
            "</div>",
            "<div class='starring'>",
                "<span>Starring: </span>", 
                (info.Actors || 'N/A'),
            "</div>",
            "<div class='year-produced'>",
                (info.Year || 'N/A'),
                "<span class='duration'>",
                    (info.Runtime || 'N/A'),
                "</span>",
                "<span class='maturity-rating'>",
                    (info.Rated || 'N/A'),
                "</span>",
            "</div>",
            "<div class='info-description'>",
                (info.Plot || 'N/A') + ' ',
            "</div>"
        ].join(''));
    };

    this.displayRatingsData_ = function(info) {
        $('.ratings').html([
            '<div class="imdb-rating">',
                '<span class="rate imdb-number">',
                    (info.imdbRating || '<div class="loading-score"></div>'),
                '</span>',
            '</div>',
            '<div class="rt-rating">',
                '<span class="rate rt-number">',
                    '<span class="user-base">Critics:</span> ',
                    (info.rtCriticsScore || '<div class="loading-score"></div>'),
                    '<span class="user-base">Users:</span>',
                    '<span class="second-rating">',
                        (info.rtAudienceScore || '<div class="loading-score"></div>'),
                    '</span>',
                '</span>',
            '</div>',
            '<div class="mc-rating">',
                '<span class="rate mc-number">',
                    (info.Metascore || '<div class="loading-score"></div>'),
                '</span>',
            '</div>'
        ].join(''));
    };

    this.displayAwardsData_ = function(info) {
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
    };
};


function cineplusController() {
    var controller = this;
    this.model = new cineplusModel();
    this.view = new cineplusView();

    this.start = function() {
        $(document).on('mouseenter', '.boxShot, .lockup', function() {
            var hoverMovieId = $(this).find('.playLink, .playHover').attr('data-uitrack').split(',')[0];
            controller.view.addMoreInfoButton($(this), hoverMovieId);
        });

        $(document).on('mouseleave', '.boxShot, .lockup', function() {
            controller.view.hideMoreInfoButton();
        });

        $(document).on('mouseover', '.boxShot, .lockup', function(e) {
            var element = $(e.target).parent().find('.boxShotImg, .boxart');
            var movieName = element.attr('alt');
            controller.view.reset(element);
            controller.view.setMovieName(movieName);
            controller.model.getMovieInfo(movieName, controller.view.displayMovieData.bind(controller.view));
        });
    };
};