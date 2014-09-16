(function () {
  // Define Properties.
  var isExpanded = false
  var isTouchDevice = 'ontouchstart' in window
  var movieMap = {}
 
  // Define DOM references.
  var body = $('body')
  var myOverlay = $('#my-overlay')
  var overlay = $('#overlay')
  var overlayContent = $('#overlay-content')
  var overlayPoster = $('#overlay-poster')
  var overlayCast = $('#overlay-cast')
  var overlaySummary = $('#overlay-summary')
  var mask = $('#mask')
  var mainContainer = $('#main-container')

  // Main point of entry.
  function main() {
    bindEvents()
    fetchData()
  }
 
  function bindEvents() {
    // Zoom out if the overlay is clicked.
    $('#mask, #my-overlay').on('click', zoomOut);
 
    // If user clicks on the content of the overlay, do not zoomOut().
    overlayContent.on('click', function(e) {
      e.stopPropagation()
    })
 
    // Zoom out if ESC key is hit.
    $(document).keyup(function(e) {
      if (isExpanded && e.which == 27) {
        zoomOut()
      }
    })
 
    // After overlay finishes animation, hide it.
    overlayContent.on('webkitTransitionEnd', function(e) {
      if (!isExpanded) {
        myOverlay.css({
          width: ''
        })
      }
    })

    $(window).resize(function() {
      if (isExpanded) {
        doLayout()  
      }
    })
  }
 
  function fetchData() {
    $.ajax({
      url: 'https://api.parse.com/1/classes/Movie',
      headers: {
        'X-Parse-Application-Id': 'dpzTDLhKP59MyYInNg6pojXkf3HdLWbndhnK9x6E',
        'X-Parse-REST-API-Key': 'Z8b75HJjAzRhQTAmcXynGGq7tMcjImdosXpxAlLm' 
      }
    }).done(populateGrid)
  }
 
  function populateGrid(data) {
    var movies = data.results
    for (var i = 0; i < movies.length; i++) {
      if (i % 3 == 0) {
        var newRow = $('<div>').addClass('row')
        mainContainer.append(newRow)
      }
 
      var newCard = createNewCard(movies[i])
      newRow.append(newCard)
    }
  }
 
  function createNewCard(movieInfo) {
    var uniqueId = movieInfo.objectId
 
    // Create element <div class="card col-sm-4"></div>.
    var newCard = $('<div>').addClass('card col-sm-4')
    newCard.attr('id', uniqueId)
 
    // Store the movie info in our movie map based on the unique ID
    movieMap[uniqueId] = movieInfo
 
    // Listen for tap on the card.
    newCard.on('click', function(e) {
      zoomIn(e)
    })
 
    // Create element <div class="card-poster"></div>.
    var newCardPoster = $('<div>').addClass('card-poster')
 
    // Create element <img src="images/1.jpg" />.
    var newImage = $('<img>').attr('src', movieInfo.poster.url)

    // Set up hierarchy.
    newCardPoster.append(newImage)
    newCard.append(newCardPoster)
 
    return newCard
  }

  function doLayout() {
    // Reveal and center the overlay.
    var overlayWidth = window.innerWidth * .95;

    myOverlay.css({
      width: '95%',
      height: window.innerHeight + 'px'
    })

    myOverlay.css({
      left: ((window.innerWidth - myOverlay.width()) / 2) + 'px'
    })
  }
 
  function zoomIn(e) {
    isExpanded = true
 
    // Get references to the card itself and the card's child poster and image.
    var card = $(e.currentTarget)

    var uniqueId = card.attr('id')
    var movieInfo = movieMap[uniqueId]
 
    // Show the mask.
    mask.show()

    body.css({
      overflow: 'hidden'
    })
    
    doLayout();
 
    // Blur the main container grid on non-touch devices.
    if (!isTouchDevice) {
      mainContainer.css('-webkit-filter', 'blur(10px)')  
    }
     
    // Put data into overlay.
    overlayPoster.attr('src', movieInfo.poster.url)
    overlayPoster.on('click', zoomOut);
    overlayCast.text(movieInfo.cast.toString().replace(/,/g, ', '))
    overlaySummary.text(movieInfo.summary)
 
    // Zoom and fade overlay into focus.
    overlayContent.css({
      'opacity': 1,
      '-webkit-transform': 'scale3d(1,1,1) translate3d(0,0,0)'
    })
 
    // Zoom into main container grid.
    mainContainer.css({
      '-webkit-transform': 'scale3d(1.1, 1.1, 1.1)'
    })
 
    // Scroll the overlay to topmost position.
    overlaySummary.scrollTop(0)
    
  }
 
  function zoomOut() {
    isExpanded = false

    body.css({
      overflow: ''
    })

    mask.hide()

    mainContainer.css({
      '-webkit-filter': '',
      '-webkit-transform': 'scale3d(1,1,1)'
    })
 
    overlayContent.css({
      'opacity': 0,
      '-webkit-transform': 'scale3d(.8,.8,.8)'
    })
  }
     
  // Launch our app by calling main.
  main()
})()