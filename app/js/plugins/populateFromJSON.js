var $ = jQuery;

( function( $ ) {
  var Neu = Neu || {};

  $.fn.populateFromJSON = function(options) {
      return this.each(function() {
          var populateFromJSON = Object.create(Neu.populateFromJSON);
          populateFromJSON.init(this, options);
      });
  };

  $.fn.populateFromJSON.options = {
      grid: ".story-grid",
      categoryList: ".story-categories",
      isPaused: false,
      userSelection: false,
  };

  Neu.populateFromJSON = {
      init: function(elem, options) {
          var self = this;
          self.$container = $(elem);
          self.options = $.extend({}, $.fn.populateFromJSON.options, options);
          self.bindElements();
          self.bindEvents();

      },
      bindElements: function() {
        var self = this;

        self.$grid = self.$container.find(self.options.grid);
        self.$categoryList = self.$container.find(self.options.categoryList);
    },
    bindEvents: function() {
      var self = this;

      $(document).ready( function() {
        self.populateFields();

        setInterval(function() {
          console.log("isPaused = " + self.options.isPaused);
          if (self.options.isPaused === false) {
            self.cycleStories();
          }
        }, 11000);

        var grid = document.getElementById("story-grid");

        //close highlighted story on click outside and resume cycleStories
        document.addEventListener('click', function(event) {
          var isClickInside = grid.contains(event.target);

          //clicked outside
          if (!isClickInside) {
            //close highlighted story
            $(".highlighted").each( function() {

              $(this).animate({
                top: 0,
                left: 0,
              });//animate
              $(this).removeClass("highlighted");
              self.options.userSelection = false;

            });//each

            setTimeout(function() {
              $(".story").not(".unclickable").addClass("unclickable");
              self.options.isPaused = false;
            }, 500);
          }//if
        });//document.addEventListener

      });

    },
    loadJSON: function(callback) {
      var self = this;

      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', '/interactive/2019/12/year-in-review-2019/data/data.json', true);
      xobj.onreadystatechange = function() {
          if (xobj.readyState === 4 && xobj.status === 200) {
              // Required use of an anonymous callback
              // as .open() will NOT return a value but simply returns undefined in asynchronous mode
              callback(xobj.responseText);
          }
      };
      xobj.send(null);
    },
    populateFields: function() {
      var self = this;

      var categoryListItem;

      self.loadJSON(function(response) {
        // Parse JSON string into object
          var data = JSON.parse(response);
          var categoryArray = [];
          var colorArray = [];

          for (var i = 0; i < data.length; i++) {
            var category = data[i].category;
            var id = i+1;

            //push categories to array to figure out how many there are
            if (!categoryArray.includes(category)) {
              categoryArray.push(category);
              self.$categoryList.append("<li class='" + category + "'><span class='bullet'></span>" + category + "</li>");
            }

            var storyEl = "<div class='story-frame'><div class='story-inner'><div id='story-" + id + "' class='story unclickable' data-cat='" + data[i].category + "'><div class='story-img'><img src='" + data[i].image + "' /></div><h2 class='story-title'><a href='" + data[i].url + "' target='_blank'>" + data[i].title + "</a></h2><p class='story-teaser'>" + data[i].teaser + "</p></div></div></div>";

            self.$grid.append(storyEl);
          }

          /********* create array of random ids ************/
          for (var a=[],i=0;i<(data.length * 0.66);++i) {
            a[i]=i;
          }

          // http://stackoverflow.com/questions/962802#962890
          function shuffle(array) {
            var tmp, current, top = array.length;
            if (top) while(--top) {
              current = Math.floor(Math.random() * (top + 1));
              tmp = array[current];
              array[current] = array[top];
              array[top] = tmp;
            }
            return array;
          }

          idArray = shuffle(a);

          console.log(idArray);
          /********* create array of random ids ************/

          // for (var i = 0; i < categoryArray.length; i++) {
          //   var color = self.getRandomColor();
          //   colorArray.push(color);
          // }
          colorArray = ["#e84040","#a00000","#3c608d","#6894cb","#e2b64c","#ef945d","#69b993","#268270"];

          $(".story").each( function() {
            var curStory = $(this);
            var parent = curStory.closest(".story-frame");
            var storyId = curStory.attr("id");
            var idArr = storyId.split("-");
            var curId = idArr[1];
            var actualId = parseInt(curId);
            //add color border based on category
            var storyCat = curStory.attr("data-cat");
            categoryListItem = self.$categoryList.find("li");

            for (var i = 0; i < colorArray.length; i++) {
              if (storyCat === categoryArray[i]) {
                $(this).css("border-left", "10px solid " + colorArray[i]);
              }

              categoryListItem.each( function() {
                var text = $(this).text();
                if ( text === categoryArray[i]) {
                  $(this).find(".bullet").css("background-color", colorArray[i]);
                }
              })
            }

            //randomly make some stories taller (by adding class names)
            for (var o = 0; o < idArray.length; o++) {
              var middleOfArray = idArray.length/2;
              var id = idArray[o];

              if (actualId === id) {
                if (o < middleOfArray) {
                  curStory.closest(".story-inner").addClass("height2");
                } else {
                  curStory.closest(".story-inner").addClass("height3");
                }
              }
            }

            //highlight story on click
            curStory.click( function(e) {
              self.options.isPaused = true;
              self.options.userSelection = true;

              if ($(this).hasClass("unclickable")) {
                e.preventDefault();

                //close any other highlighted story
                $(".story").not(curStory).each( function() {
                  $(this).removeClass("highlighted");
                  $(this).animate({
                    top: 0,
                    left: 0
                  })

                  setTimeout(function() {
                    $(this).addClass("unclickable");
                  }, 500);
                });

                //highlight the clicked story
                $(this).addClass("highlighted");
                $(this).removeClass("unclickable");
                self.animateHighlightStory($(this));
              }
            });

            //grey out all sibling with a different category when hovering over story
            parent.hover( function() {

              self.options.isPaused = true;
              var highlightOpen = false;
              var stories = $(".story");

              for (var i=0; i < stories.length; i++) {
                var current = stories[i];
                if ( $(current).hasClass("highlighted") ) {
                  highlightOpen = true;
                }
              }

              if (highlightOpen === false) {
                $(".story").not(curStory).each( function() {
                  var story = $(this);
                  var siblingCat = $(this).attr("data-cat");

                  if (siblingCat !== storyCat) {
                    story.addClass("inactive");
                  }
                });
              }
            }, function() {
              //if the user has clicked the story, ignore the next steps
              if (self.options.userSelection === true) {
                $(".story").removeClass("inactive");
                return;
              }

              $(".story").removeClass("inactive");
              self.options.isPaused = false;
              highlightOpen = false;
            });

          });

          //Highlight all category items when hovering over category
          categoryListItem.hover( function() {
            self.options.isPaused = true;
            var category = $(this).attr("class");


            $(".story").each( function() {
              var storyCat = $(this).attr("data-cat");
              var story = $(this);

              if (category !== storyCat) {
                story.addClass("inactive");
              }
            });

            //make sure siblings are hidden first
            $(".category-intro li").removeClass("visible");
            $(".category-intro li").each( function() {
              var introCat = $(this).attr("id");

              if (category === introCat) {
                $(this).addClass("visible");
              }
            })
          }, function() {
            $(".story").removeClass("inactive");
            self.options.isPaused = false;
          });

      });

    },
    getRandomColor: function() {
      var self = this;

      function randomIntFromInterval(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

      //create colors within a specific range
      // var r = Math.round(Math.random()*50);
      // var g = randomIntFromInterval(50, 170);
      // var b = randomIntFromInterval(150, 255);

      //create colors within a specific range
      var r = randomIntFromInterval(0, 255);
      var g = randomIntFromInterval(0, 255);
      var b = randomIntFromInterval(0, 255);

      var color = 'rgb(' + r + ',' + g + ',' + b + ')';

      return color;
    },
    cycleStories: function() {
      var self = this;
      var stories = $(".story");
      var randomNumber = Math.floor(Math.random() * stories.length);
      var id = "#story-" + randomNumber;

      var highlightStory = $(id);

      stories.removeClass("highlighted");

      highlightStory.addClass("highlighted");
      highlightStory.removeClass("unclickable");

      self.animateHighlightStory(highlightStory);

      setTimeout(function() {
        if (self.options.isPaused === true) {
          return;
        }
        highlightStory.animate({
          top: 0,
          left: 0
        })

        stories.removeClass("highlighted");
        setTimeout(function() {
          highlightStory.addClass("unclickable");
        }, 500);

      }, 8000);

    },
    animateHighlightStory: function(highlightStory) {
      var self = this;

      //************ Calculate distance to move ****************//
      //find vertical and horizontal position of element
      var storyTop = $(highlightStory).offset().top - $(window).scrollTop();
      var storyLeft = $(highlightStory).offset().left;
      //find vertical and horizontal center of window
      var horizontalCenter = $(window).width() /2;
      var verticalCenter = $(window).height() / 2;

      var storyWidth;

      if ($(window).width() < 768) {
        storyWidth = $(window).width() * 0.4;
      } else if ($(window).width() < 1200) {
        storyWidth = $(window).width() * 0.35;
      } else {
        storyWidth = 300;
      }

      var storyHeight;

      if ($(window).width() < 768) {
        storyHeight = $(window).width() * 0.3;
      } else if ($(window).width() < 1200) {
        storyHeight = $(window).width() * 0.25;
      } else {
        storyHeight = 200;
      }

      //calculate the difference between element's position and the center of the page
      var leftDifference;
      if (horizontalCenter > storyLeft) {
        var calcMiddle = horizontalCenter - storyLeft;
        leftDifference = calcMiddle - storyWidth;
      } else {
        var calcMiddle = -( (storyLeft - horizontalCenter) + storyWidth);
        leftDifference = calcMiddle;
      }

      var topDifference;
      if (verticalCenter > storyTop) {
        var calcMiddle = verticalCenter - storyTop;
        topDifference = calcMiddle - storyHeight;
      } else {
        var calcMiddle = -( (storyTop - verticalCenter) + storyHeight);
        topDifference = calcMiddle;
      }

      //************ Calculate distance to move ****************//


      highlightStory.animate({
        top: topDifference,
        left: leftDifference
      })


    }
  };

}( $ ) );

(function init () {
  $(document).ready(function() {
    $(".yir-wrapper").populateFromJSON();

    setTimeout(function() {
      var $grid = $('.story-grid').imagesLoaded( function() {

        $grid.masonry({
          // options
          itemSelector: '.story-frame',
          columnWidth: '.grid-sizer',
          percentPosition: true
        });
      })
    }, 500);
  });
})();
