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
      categoryItem: ".category li",
      categoryList: ".story-categories",
      isPaused: true,
      isInit: false,
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
        self.$categoryItem = self.$container.find(self.options.categoryItem);
        self.$categoryList = self.$container.find(self.options.categoryList);
    },
    bindEvents: function() {
      var self = this;

      $(document).ready( function() {
        self.populateFields();
        // self.categorySlider();

        setInterval(function() {
          if (self.options.isPaused === false && self.options.isInit === true) {
            self.cycleStories();
          }
        }, 14000);

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

              //remove underline of the category that was highlighted
              self.$categoryList.find("li").removeClass("active");

            });//each

            setTimeout(function() {
              $(".story").removeClass("overlay");
              $(".story").not(".unclickable").addClass("unclickable");
              self.options.isPaused = false;
            }, 500);
          }//if
        });//document.addEventListener

      });

      //make the categories fixed on scroll
      window.onscroll = function() { makeSticky(), initPopup() };

      var catList = $(self.options.categoryList);
      var sticky = catList.offset().top;

      function makeSticky() {
        if (window.pageYOffset > sticky) {
          catList.addClass("fixed");
        } else {
          catList.removeClass("fixed");
        }
      }

      var widthToDetract;

      if ($(window).width() < 1200) {
        widthToDetract = $(window).width() / 4;
      } else {
        widthToDetract = 300;
      }

      var startPopup = catList.offset().top - widthToDetract;

      function initPopup() {
        if (window.pageYOffset > startPopup) {
          self.options.isInit = true;
        } else {
          self.options.isInit = false;
        }
      }

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
            var fullCategory = data[i].category;
            var splitCat = fullCategory.split(" ");
            var intCategory = splitCat[0];
            var category = intCategory.replace(/,/g, '');
            var id = i+1;
            var orgImg = data[i].image;
            var orgImgSplit = orgImg.split("/");
            var imageNameExt = orgImgSplit[7];
            var imageNameExtSplit = imageNameExt.split(".");
            var imageName = orgImgSplit[7];
            var thumb = "/interactive/2019/12/year-in-review-2019/images/thumb/" + imageName;

            //push categories to array to figure out how many there are
            if (!categoryArray.includes(category)) {
              categoryArray.push(category);
              self.$categoryList.append("<li class='" + category + "'><span class='bullet'></span>" + fullCategory + "</li>");
            }

            var storyEl = "<div class='story-frame'><div class='story-inner'><div id='story-" + id + "' class='story unclickable' data-cat='" + category + "'><div class='story-img'><img data-org='" + data[i].image + "' src='" + thumb + "' /></div><div class='story-content'><h2 class='story-title'><a href='" + data[i].url + "' target='_blank'>" + data[i].title + "</a></h2></div></div></div></div>";

            // <p class='story-teaser'>" + data[i].teaser + "</p>

            self.$grid.append(storyEl);
          }

          colorArray = ["#e84040","#a00000","#3c608d","#6894cb","#e2b64c","#ef945d","#69b993","#268270", "#962890"];

          $(".story").each( function() {
            var curStory = $(this);
            var parent = curStory.closest(".story-frame");
            var storyId = curStory.attr("id");
            var idArr = storyId.split("-");
            var curId = idArr[1];
            var actualId = parseInt(curId);

            /*******  add color border based on category *********/
            var storyCat = curStory.attr("data-cat");
            categoryListItem = self.$categoryList.find("li");

            for (var i = 0; i < colorArray.length; i++) {
              if (storyCat === categoryArray[i]) {
                // $(this).css("border-left", "10px solid " + colorArray[i]);
                $(this).prepend("<span class='story-bullet' style='background-color:" + colorArray[i] + "'></span><span class='story-category' style='color: " + colorArray[i] + "'>" + storyCat + "</span>")
              }

              categoryListItem.each( function() {
                var listId = $(this).attr("class");
                if ( listId === categoryArray[i]) {
                  $(this).find(".bullet").css("background-color", colorArray[i]);
                }
              })
            }
            /*******  end: add color border based on category *********/

            //highlight story on click
            curStory.click( function(e) {
              self.options.isPaused = true;
              self.options.userSelection = true;
              var imageEl = $(this).find("img");
              var thumb = imageEl.attr("src");
              var largeImage = imageEl.attr("data-org");
              imageEl.attr("src", largeImage);
              imageEl.attr("data-thumb", thumb);

              if ($(this).hasClass("unclickable")) {
                e.preventDefault();

                //close any other highlighted story and add overlay
                $(".story").not(curStory).each( function() {
                  $(this).removeClass("highlighted");
                  $(this).addClass("overlay");
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
                $(this).removeClass("overlay");
                self.animateHighlightStory($(this));
              }
            });

            //grey out all sibling with a different category when hovering over story
            //parent is the story's wrapper $(".story-frame");
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

                  //add inactive class that greys it out
                  if (siblingCat !== storyCat) {
                    story.addClass("inactive");
                  }
                });

                /***** also highlight the category and show respective intro text *****/
                categoryListItem.each( function() {
                  var listId = $(this).attr("class");
                  if ( listId === storyCat) {
                    $(this).addClass("active");
                  }
                })

                // $(".category li").removeClass("visible");
                // $(".category li").each( function() {
                //   var introCat = $(this).attr("id");
                //   var contentHeight = $(this).height();
                //
                //   if (storyCat === introCat) {
                //     $(this).addClass("visible");
                //     $(".category").css("height", contentHeight);
                //   }
                // })
                /***** end:also highlight the category and show respective intro text *****/
              }

            }, function() {
              //if the user has clicked the story, ignore the next steps
              if (self.options.userSelection === true) {
                $(".story").removeClass("inactive");
                return;
              }

              categoryListItem.removeClass("active");
              $(".story").removeClass("inactive");
              self.options.isPaused = false;
              highlightOpen = false;
            });

          });

          //Highlight all category items when hovering over category
          categoryListItem.hover( function() {
            self.options.isPaused = true;
            var highlightOpen = false;
            var stories = $(".story");

            for (var i=0; i < stories.length; i++) {
              var current = stories[i];
              if ( $(current).hasClass("highlighted") ) {
                highlightOpen = true;
              }
            }

            var category = $(this).attr("class");


            if (highlightOpen === false) {
              $(".story").each( function() {
                var storyCat = $(this).attr("data-cat");
                var story = $(this);

                if (category !== storyCat) {
                  story.addClass("inactive");
                }
              });
            }

            //display intro text for the current category
            //make sure siblings are hidden first
            $(".category li").removeClass("visible");
            $(".category li").each( function() {
              var introCat = $(this).attr("id");
              // var contentHeight = $(this).height();

              if (category === introCat) {
                $(this).addClass("visible");
                // $(".category").css("height", contentHeight);
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

      var imageEl = highlightStory.find("img");
      var thumb = imageEl.attr("src");
      var largeImage = imageEl.attr("data-org");
      imageEl.attr("src", largeImage);
      imageEl.attr("data-thumb", thumb);

      stories.removeClass("highlighted");
      stories.addClass("overlay");
      //remove underline of any category that may have been active
      self.$categoryList.find("li").removeClass("active");

      highlightStory.addClass("highlighted");
      highlightStory.removeClass("unclickable");
      highlightStory.removeClass("overlay");

      self.animateHighlightStory(highlightStory);

      setTimeout(function() {
        if (self.options.isPaused === true || self.options.isInit === false) {
          return;
        }
        highlightStory.animate({
          top: 0,
          left: 0
        })

        stories.removeClass("highlighted");
        setTimeout(function() {
          highlightStory.addClass("unclickable");
          stories.removeClass("overlay");
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
  });

  $(window).on("load", function() {
    setTimeout(function() {
      $('.story-grid').masonry({
        // options
        itemSelector: '.story-frame',
        columnWidth: '.grid-sizer',
        percentPosition: true
      });
      $(".loader").hide();
    }, 500);

  });
})();
