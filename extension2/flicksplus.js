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
    var ctl = this;
    this.view = new cineplusView();
    this.model = new cineplusModel();

    this.activeInfoBoxCls = '.jawBoneOpenContainer:not(.jawBoneOpen-leave)';    // The info box for a movie on each row of the page.
    this.billboardCls = '.billboard';   // Info box for a movie in the slideshow on the top of the home page.
    this.billboardCtnCls = '.billboard-row';    // Slideshow of movies on the top of the home page.
    this.featuredCls = '.jawBoneContainer'; // Info box for the featured movie on the top of the movie page.
    this.galleryCls = '.gallery .galleryContent';   // The static gallery view on the browse pages.
    this.infoBoxCls = '.jawBoneContent';    // The info box container for a movie on each row of the page.
    this.loadableCls = '.lolomo';   // The infinite loading gallery view on the home page.
    this.loadableGalleryCls = '.galleryLockups';    // The infinite loading gallery on the browse pages.
    this.mainViewCls = '.mainView'; // Main view, always on page.
    this.searchGalleryCls = 'div .gallery .galleryContent'; // The static gallery view on the search pages.

    this.start = function() {
        var mainViewEl = document.querySelector(ctl.mainViewCls);
        if (mainViewEl) {
            ctl.mainViewInit(mainViewEl);
            ctl.startObserver(mainViewEl, ctl.mainViewMutationHandler);
        }
    };

    this.mainViewInit = function(element) {
        var loadableEl = element.querySelector(ctl.loadableCls);
        var galleryEl = element.querySelector(ctl.galleryCls);
        var featuredEl = element.querySelector(ctl.featuredCls);
        var billboardCtnEl = element.querySelector(ctl.billboardCtnCls);
        var searchGalleryEl = element.querySelector(ctl.searchGalleryCls);

        // Populate ratings for the gallery info boxes.
        if (loadableEl) {
            ctl.galleryInit(loadableEl);
        } else if (searchGalleryEl) {
            ctl.startObserver(searchGalleryEl, ctl.galleryMutationHandler);
            ctl.startObserver(element.querySelector('div'), ctl.searchGalleryMutationHandler);
        } else if (galleryEl) {
            ctl.startObserver(galleryEl, ctl.galleryMutationHandler);
        }

        // Populate ratings for the featured movie info box.
        if (featuredEl) {
            ctl.addRatings(featuredEl);
        }

        // Populate ratings for the movie slide show info boxes.
        if (billboardCtnEl) {
            ctl.addRatings(billboardCtnEl);
            ctl.startObserver(billboardCtnEl, ctl.billboardMutationHandler);
        }
    };

    this.galleryInit = function(element) {
        // Listen to the info boxes already loaded and as they load.
        ctl.startObserver(element, ctl.cardLoadMutationHandler);

        var infoBoxes = element.querySelectorAll(ctl.infoBoxCls);
        for (var i = 0; i < infoBoxes.length; i++) {
            ctl.startObserver(infoBoxes[i], ctl.cardClickMutationHandler);
        }
    };

    this.startObserver = function(element, mutationHandler) {
        // Create a new instance of an observer.
        var observer = new MutationObserver(mutationHandler);
        var config = {childList: true};
        observer.observe(element, config);
    };

    this.galleryMutationHandler = function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                var galleryEl = mutation.target.querySelector(ctl.loadableGalleryCls);
                if (galleryEl) {
                    ctl.galleryInit(galleryEl);
                }
            }
        });
    }

    this.searchGalleryMutationHandler = function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                var galleryEl = mutation.target.querySelector(ctl.galleryCls);
                if (galleryEl) {
                    ctl.startObserver(galleryEl, ctl.galleryMutationHandler);
                }
            }
        });
    }

    this.outputMutationHandler = function(mutations) {
        mutations.forEach(function(mutation) {
            console.log(mutation);
        });
    }

    this.mainViewMutationHandler = function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.removedNodes.length > 0) {
                ctl.mainViewInit(mutation.target);
            }
        });
    }

    this.billboardMutationHandler = function(mutations) {
        // Mutation handler for billboard (slideshow of movies at the top)
        mutations.forEach(function(mutation) {
            var billboardEl = mutation.target.querySelector(ctl.billboardCls);
            if (billboardEl) {
                ctl.addRatings(billboardEl);
            }
        });
    }

    this.cardLoadMutationHandler = function(mutations) {
        // Mutation handler for info boxes being loaded
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var infoBox = mutation.addedNodes[i].querySelector(ctl.infoBoxCls);
                if (infoBox) {
                    ctl.startObserver(infoBox, ctl.cardClickMutationHandler);
                }
            }
        });
    };

    this.cardClickMutationHandler = function(mutations) {
        // Mutation handler for .jawBoneContent (changes for every row)
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                var infoBoxEl = mutation.target.querySelector(ctl.activeInfoBoxCls);
                if (infoBoxEl) {
                    ctl.startObserver(infoBoxEl, ctl.cardHoverMutationHandler);
                    ctl.addRatings(infoBoxEl);
                }
            }
        });
    };

    this.cardHoverMutationHandler = function(mutations) {
        // Mutation handler for .jawBoneOpenContainer element (changes for every movie)
        mutations.forEach(function(mutation) {
            if (mutation.removedNodes.length > 0) {
                ctl.addRatings(mutation.target);
            }
        });
    };

    this.addRatings = function(infoBox) {
        var title = ctl.view.getTitle(infoBox);
        var year = ctl.view.getYear(infoBox);
        ctl.view.displayRatings(infoBox);
        ctl.model.getRatings(title, year, ctl.view.displayRatings, infoBox);
    }
};
