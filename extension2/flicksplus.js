var showRunner = new cineplusController();
showRunner.start();

function cineplusModel() {
    var cineplusModel = this;
    this.data = {};
    this.notAvailable = '<div class="not-available">N/A</div>';

    this.getRatings = function(title, year, callback, infoBox) {
        cineplusModel.data = {};
        cineplusModel.getOmdbData(title, year, callback, infoBox);
        cineplusModel.getRTData(title, year, callback, infoBox);
    }

    this.getOmdbData = function(title, year, callback, infoBox) {
        var omdbRequestUrl = 'http://www.omdbapi.com/?t=' + title + '&y=' + year;
        $.ajax({
            type: "GET", 
            url: omdbRequestUrl, 
            dataType: 'json', 
            success: function(movieInfo){
                cineplusModel.data['imdbRating'] = movieInfo['imdbRating'] || cineplusModel.notAvailable;
                cineplusModel.data['Metascore'] = movieInfo['Metascore'] || cineplusModel.notAvailable;
                if (movieInfo['imdbRating'] === 'N/A') {
                    cineplusModel.data['imdbRating'] = cineplusModel.notAvailable;
                }
                if (movieInfo['Metascore'] === 'N/A') {
                    cineplusModel.data['Metascore'] = cineplusModel.notAvailable;
                }
            },
            complete: function() {
                callback(infoBox, cineplusModel.data);
            }
        });
    };

    this.getRTData = function(title, year, callback, infoBox) {
        var rtRequestUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=u4f7ar7byc87wg3qxs9u8ecm&q=' + title;
        $.ajax({
            type: "GET",
            url: rtRequestUrl,
            dataType: 'json',
            success: function(RTInfo) {
                var ratings = {};
                for (var i = 0; i < RTInfo.movies.length; i++) {
                    if (RTInfo.movies[i].title == title &&
                        RTInfo.movies[i].year == year) {
                        ratings = RTInfo.movies[i].ratings;
                    }
                }
                cineplusModel.data['rtScore'] = ((ratings.critics_score > 0) ? ratings.critics_score + '%' : cineplusModel.notAvailable);
                cineplusModel.data['rtRating'] = ratings.critics_rating;            
            },
            complete: function() {
                callback(infoBox, cineplusModel.data);
            }
        });
    };
};

function cineplusView() {
    this.getTitle = function(infoBox) {
        var title = '';
        var titleElement = infoBox.querySelector('.title');
        // Only for billboards
        var imageTitleElement = infoBox.querySelector('.title-treatment');
        if (titleElement) {
            title = titleElement.innerText;
            if (title === "") {
                title = infoBox.querySelector('.title img').alt;
            }
        } else if (imageTitleElement) {
            title = imageTitleElement.alt;
        }
        return title;
    };

    this.getYear = function(infoBox) {
        return infoBox.querySelector(".year").innerText;
    };

    this.displayRatings = function(element, info) {
        var rtRatingToClass = {
            'Certified Fresh': 'cfresh',
            'Rotten': 'rotten'
        }
        info = info || {};
        $(element).find('#imdb-rating, #rt-rating').remove();
        var ratings = $([
            '<span id="imdb-rating">',
            (info.imdbRating || '<div class="loading-score"></div>'),
            '</span>',
            '<span id="rt-rating">',
            (info.rtScore || '<div class="loading-score"></div>'),
            '</span>'
        ].join(''));
        ratings.insertAfter($(element).find('.duration'));
        if (rtRatingToClass[info.rtRating]) {
            $(element).find('#rt-rating').addClass(rtRatingToClass[info.rtRating]);
        }
    };
};


function cineplusController() {
    var controller = this;
    this.view = new cineplusView();
    this.model = new cineplusModel();

    this.start = function() {
        // TODO: make this work for genre and search pages.

        // Populate ratings for the featured movie if applicable (on movie pages)
        var topInfoBox = document.querySelector('.mainView .jawBoneContainer');
        if (topInfoBox) {
            controller.addRatings(topInfoBox);
        }

        // Listen to the billboard pane if applicable (on home page)
        var billboard = document.querySelector('.mainView .billboard-row');
        if (billboard) {
            controller.addRatings(billboard);
            controller.startObserver(billboard, controller.billboardMutationHandler);
        }

        // Listen to the 4 initial info boxes
        var infoBoxes = document.getElementsByClassName('jawBoneContent');
        for (var i = 0; i < infoBoxes.length; i++) {
            controller.startObserver(infoBoxes[i], controller.cardClickMutationHandler);
        }

        // Listen to info boxes as they load
        var infoBoxContainer = document.querySelector('.lolomo');
        controller.startObserver(infoBoxContainer, controller.cardLoadMutationHandler);
    };

    this.startObserver = function(element, mutationHandler) {
        // Create a new instance of an observer.
        var observer = new MutationObserver(mutationHandler);
        var config = {childList: true};
        observer.observe(element, config);
    };

    this.billboardMutationHandler = function(mutations) {
        // Mutation handler for .billboard-row (slideshow of movies at the top)
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0 &&
                mutation.previousSibling === document.querySelector('.nav-layer.nav-dots')) {
                controller.addRatings(mutation.target);
            }
        });
    }

    this.cardLoadMutationHandler = function(mutations) {
        // Mutation handler for .lolomo (loads additional rows)
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var infoBox = mutation.addedNodes[i].querySelector('.jawBoneContent');
                controller.startObserver(infoBox, controller.cardClickMutationHandler);
            }
        });
    };

    this.cardClickMutationHandler = function(mutations) {
        // Mutation handler for .jawBoneContent (changes for every row)
        var activeInfoBox = document.querySelector('.jawBoneOpenContainer:not(.jawBoneOpen-leave)');
        controller.startObserver(activeInfoBox, controller.cardHoverMutationHandler);
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                controller.addRatings(activeInfoBox);
            }
        });
    };

    this.cardHoverMutationHandler = function(mutations) {
        // Mutation handler for .jawBoneOpenContainer element (changes for every movie)
        mutations.forEach(function(mutation) {
            if (mutation.removedNodes.length > 0) {
                controller.addRatings(mutation.target);
            }
        });
    };

    this.addRatings = function(infoBox) {
        var title = controller.view.getTitle(infoBox);
        var year = controller.view.getYear(infoBox);
        controller.view.displayRatings(infoBox);
        controller.model.getRatings(title, year, controller.view.displayRatings, infoBox);
    }
};
