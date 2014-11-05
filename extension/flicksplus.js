var showRunner = new cineplusController();
showRunner.start();

function cineplusModel() {
    var cineplusModel = this;
    this.data = {};
    this.notAvailable = '<div class="not-available">N/A</div>';

    this.getMovieInfo = function(movieId, callback) {
        if (this.data[movieId]) {
            callback(this.data[movieId]);
        } else {
            this.data[movieId] = {
                'id': movieId
            };
            this.getNetflixInfo_(this.data[movieId], callback);
            this.getOmdbInfo_(this.data[movieId], callback);
            this.getRTInfo_(this.data[movieId], callback);
            callback(this.data[movieId]);
        }
    };

    this.netflixInfoReady = function(callback) {
        var movieId = $('#BobMovie .agMovie').attr('id') || 'bob' + $('#bob-container #bob').attr('data-titleid');
        if (movieId) {
            movieId = movieId.trim();
            if (this.data[movieId]) {
                if (!this.data[movieId]['hasNetflixInfo']) {
                    this.setNetflixInfo_(this.data[movieId], callback);
                }
            } else {
                this.data[movieId] = {
                    'id': movieId
                };
                this.setNetflixInfo_(this.data[movieId], callback);
            }
        }
    };

    this.getNetflixInfo_ = function(movieData, callback) {
        var netflixRequestUrl = 'http://54.69.188.189:8001/get?site=Netflix&id=' + movieData.id;
        $.ajax({
            type: "GET",
            url: netflixRequestUrl,
            dataType: 'json',
            success: function(movieInfo) {
                $.extend(movieData, movieInfo); 
                movieData['hasNetflixInfo'] = true
            },
            complete: function() {
                callback(movieData);
            }
        })
    };

    this.getOmdbInfo_ = function(movieData, callback) {
        var omdbRequestUrl = 'http://54.69.188.189:8001/get?site=OMDB&id=' + movieData.id;
        $.ajax({
            type: "GET", 
            url: omdbRequestUrl, 
            dataType: 'json', 
            success: function(movieInfo){
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
            },
            complete: function() {
                callback(movieData);
            }
        });
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

    this.getRTInfo_ = function(movieData, callback) {
        var rtRequestUrl = 'http://54.69.188.189:8001/get?site=RT&id=' + movieData.id;
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

    this.setNetflixInfo_ = function(movieData, callback) {
        if ($('#BobMovie').length) {
            var title = $('#BobMovie .title').text().trim();
            var directors = $('#BobMovie .bobMovieContent .info dd').last().text().trim();
            directors = $.map(directors.split(','), function(string) {return string.trim();}).join(', ');
            var actors = $('#BobMovie .bobMovieContent .info dd').first().text().trim();
            actors = $.map(actors.split(','), function(string) {return string.trim();}).join(', ');
            var year = $('#BobMovie .year').text().trim();
            var rating = $('#BobMovie .mpaaRating').text().trim();
            var duration = $('#BobMovie .duration').text().trim();
            var plot = $('#BobMovie .bobMovieContent').clone().find('.readMore, .info, .midBob').remove().end().text().trim();
        } else if ($('#bob-container').length) {
            var title = $('#bob .title').text().trim();
            var people = $('#bob .persons').text().trim().split('  ').filter(function(item) {return item;});
            var actors = (people[0] || ':').split(':')[1];
            var directors = (people[1] || ':').split(':')[1];
            var year = $('#bob .year').text().trim();
            var rating = $('#bob .mpaaRating').text().trim();
            var duration = $('#bob .runtime').text().trim();
            var plot = $('#bob .synopsis').clone().find('.mdpLink').remove().end().text().trim();
        }

        movieData['title'] = title;
        movieData['directors'] = directors;
        movieData['actors'] = actors;
        movieData['year'] = year;
        movieData['rating'] = rating;
        movieData['runtime'] = duration;
        movieData['plot'] = plot;
        movieData['hasNetflixInfo'] = true;

        this.sendNetflixInfo_(movieData, callback);
        callback(movieData);
    };

    this.sendNetflixInfo_ = function(movieData, callback) {
        var netflixSendUrl = ([
            'http://54.69.188.189:8001/set?site=Netflix',
            '&id=' + encodeURIComponent(movieData['id']),
            '&title=' + encodeURIComponent(movieData['title']),
            '&directors=' + encodeURIComponent(movieData['directors']),
            '&actors=' + encodeURIComponent(movieData['actors']),
            '&year=' + encodeURIComponent(movieData['year']),
            '&rating=' + encodeURIComponent(movieData['rating']),
            '&runtime=' + encodeURIComponent(movieData['runtime']),
            '&plot=' + encodeURIComponent(movieData['plot'])
        ]).join('')
        $.ajax({
            type: "GET",
            url: netflixSendUrl,
            dataType: 'json',
            complete: function() {
                cineplusModel.getOmdbInfo_(movieData, callback);
                cineplusModel.getRTInfo_(movieData, callback);
            }
        });
    };

};

function cineplusView() {
    this.movieId = '';
    $('.connect-overlay.connect').remove();
    $('body').append('<div class="added-description"><div class="nested-div"><h2 class="opening-title">What would you like to watch today?</h2></div></div>');

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
        $('#BobMovie, #bob-container').css('margin-top', '-999px');
    };

    this.setMovieId = function(movieId) {
        this.movieId = movieId;
    }

    this.addMoreInfoButton = function(element, movieId) {
        element.find('.more-info-link').remove();
        element.append('<a class="more-info-link" href="http://www.netflix.com/WiMovie/' + movieId + '">More Info</a>');
    };

    this.hideMoreInfoButton = function() {
        $('.more-info-link').hide();
    };

    this.displayMovieData = function(movieData) {
        if (movieData.id === this.movieId) {
            this.displayMovieData_(movieData);
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

    this.displayMovieData_ = function(info) {
        if (info.hasNetflixInfo) {
            $('.info-blob').html([
                "<div class='movie-title'>", 
                    (info.title || 'N/A'),
                "</div>",
                "<div class='directed-by'>",
                    "<span>Director: </span>", 
                    (info.directors || 'N/A'),
                "</div>",
                "<div class='starring'>",
                    "<span>Starring: </span>", 
                    (info.actors || 'N/A'),
                "</div>",
                "<div class='year-produced'>",
                    (info.year || 'N/A'),
                    "<span class='maturity-rating'>",
                        (info.rating || 'N/A'),
                    "</span>",
                    "<span class='duration'>",
                        (info.runtime || 'N/A'),
                    "</span>",
                "</div>",
                "<div class='info-description'>",
                    (info.plot || 'N/A') + ' ',
                "</div>"
            ].join(''));
        } else {
            $('.info-blob').html('<div class="loading-score"></div>');
        }
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
    this.netflixObserver = new MutationObserver(function(mutations) {
        controller.model.netflixInfoReady.bind(controller.model)(
            controller.view.displayMovieData.bind(controller.view)
        );
    });
    this.netflixObserverConfig = { attributes: true };

    this.start = function() {
        $(document).on('mouseenter', '.boxShot, .lockup', function() {
            var hoverMovieId = $(this).find('.playLink, .playHover').attr('data-uitrack').split(',')[0];
            controller.view.addMoreInfoButton($(this), hoverMovieId);
            controller.netflixObserver.observe(document.querySelector('#BobMovie, #bob-container'), controller.netflixObserverConfig);
        });

        $(document).on('mouseleave', '.boxShot, .lockup', function() {
            controller.view.hideMoreInfoButton();
            controller.netflixObserver.disconnect();
        });

        $(document).on('mouseover', '.boxShot, .lockup', function(e) {
            var element = $(e.target).parent().find('.boxShotImg, .boxart');
            var movieId = $(this).find('.playLink, .playHover').attr('data-uitrack').split(',')[0];
            movieId = 'bob' + movieId;
            controller.view.reset(element);
            controller.view.setMovieId(movieId);
            controller.model.getMovieInfo(movieId, controller.view.displayMovieData.bind(controller.view));
        });
    };
};
