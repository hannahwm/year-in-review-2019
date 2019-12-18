var $ = jQuery;

( function( $ ) {
  var Neu = Neu || {};

  $.fn.categorySlider = function(options) {
      return this.each(function() {
          var categorySlider = Object.create(Neu.categorySlider);
          categorySlider.init(this, options);
      });
  };

  $.fn.categorySlider.options = {
      categoryItem: ".category li",
  };

  Neu.categorySlider = {
    init: function(elem, options) {
        var self = this;
        self.$container = $(elem);
        self.options = $.extend({}, $.fn.categorySlider.options, options);
        self.bindElements();
        self.bindEvents();
        self.categorySlider();
    },
    bindElements: function() {
      var self = this;

      self.$categoryItem = self.$container.find(self.options.categoryItem);
    },
    bindEvents: function() {
      var self = this;

      $(document).ready( function() {
      });
    },
    categorySlider: function() {
      var self = this;

      self.$categoryItem.each( function() {
        var prev;
        var next;
        var prevCat;
        var nextCat;

        if ($(this).is(":first-child")) {
          prev = $(".category li:last-child");
          prevCat = prev.children(".category-title").text();
        } else if ($(this).is(":nth-child(2)")) {
          prev = $(this).prev();
          prevCat = "Explore";
        } else {
          prev = $(this).prev();
          prevCat = prev.children(".category-title").text();
        }

        if ($(this).is(":last-child")) {
          next = $(".category li:first-child");
          nextCat = "Explore";
        } else {
          next = $(this).next();
          nextCat = next.children(".category-title").text();
        }

        var prevId = prev.attr("id");
        var nextId = next.attr("id");

        $(this).append("<button id='" + prevId + "' class='category-prev'>" + prevCat + "</button><button id='" + nextId + "' class='category-next'>" + nextCat + "</button>")
      });

      var prevButton = $(".category-prev");
      var nextButton = $(".category-next");

      var contentHeight;
      prevButton.click( function() {
        var btnId = $(this).attr("id");
        var curSlide;
        self.$categoryItem.removeClass("visible");
        self.$categoryItem.each( function() {
          var introCat = $(this).attr("id");
          if (btnId === introCat) {
            $(this).addClass("visible");
            curSlide = $(this);
          }
        })
        // contentHeight = curSlide.height();
        // $(".category").css("height", contentHeight);
      });

      nextButton.click( function() {
        var btnId = $(this).attr("id");
        var curSlide;
        self.$categoryItem.removeClass("visible");
        self.$categoryItem.each( function() {
          var introCat = $(this).attr("id");
          if (btnId === introCat) {
            $(this).addClass("visible");
            curSlide = $(this);
          }
        })
        // contentHeight = curSlide.height();
        // $(".category").css("height", contentHeight);
      });
    },
  };

}( $ ) );

(function init () {
  $(document).ready(function() {
    $(".yir-wrapper").categorySlider();
  });
})();

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
      categorySelected: false
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

      $(window).on("load", function() {
        setTimeout(function() {
          $(".story-close").each(function() {
            $(this).on("click touch", function() {
              self.closeStory();
            });
          });
        }, 500);

      });

      $(document).ready( function() {
        self.populateFields();
        // self.categorySlider();

        // setInterval(function() {
        //   if (self.options.isPaused === false && self.options.isInit === true) {
        //     self.cycleStories();
        //   }
        // }, 14000);

        var sliderButton = $(".category button");

        sliderButton.on("click", function() {
          var category = $(this).attr("id");
          self.options.categorySelected = true;

          $(".story-categories li").each( function() {
            if ($(this).hasClass(category)) {
              $(this).addClass("isClicked active");
            } else {
              $(this).removeClass("isClicked");
              $(this).removeClass("active");
            }
          });


          self.highlightAllInCategory(category);
        });

        var grid = document.getElementById("story-grid");
        var categoryListByID = document.getElementById("category-list");
        var slider = document.getElementById("category-slider");

        //close highlighted story on click outside and resume cycleStories
        document.addEventListener('click', function(event) {
          var isClickInside = grid.contains(event.target);
          var isClickOnCategoryList = categoryListByID.contains(event.target);
          var isClickOnSlider = slider.contains(event.target);

          //clicked outside of category list
          if (!isClickOnCategoryList && !isClickInside && !isClickOnSlider) {
            $(".story").removeClass("inactive");
            self.options.categorySelected = false;
            $(".story-categories li").removeClass("isClicked active");
          }

          //clicked outside
          if (!isClickInside) {
            self.closeStory();
          }//if
        });//document.addEventListener

      });

      /********  make the categories fixed on scroll *****/
      // , initPopup()
      window.onscroll = function() { makeSticky() };

      var catList = $(self.options.categoryList);
      var sticky = catList.offset().top;

      function makeSticky() {
        if (window.pageYOffset > sticky) {
          catList.addClass("fixed");
        } else {
          catList.removeClass("fixed");
        }
      }
      /********  make the categories fixed on scroll *****/

      // var widthToDetract;
      //
      // if ($(window).width() < 1200) {
      //   widthToDetract = $(window).width() / 4;
      // } else {
      //   widthToDetract = 300;
      // }
      //
      // var startPopup = catList.offset().top - widthToDetract;
      //
      // function initPopup() {
      //   if (window.pageYOffset > startPopup) {
      //     self.options.isInit = true;
      //   } else {
      //     self.options.isInit = false;
      //   }
      // }

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
            var category = intCategory.replace(/'|,/g, '');
            var id = i+1;
            var orgImg = data[i].image;
            var orgImgSplit = orgImg.split("/");
            var imageNameExt = orgImgSplit[7];
            var imageName;
            if (imageNameExt) {
              var imageNameExtSplit = imageNameExt.split(".");
              imageName = imageNameExtSplit[0];
            } else {
              imageName = "undefined";
            }
            var thumb = "/interactive/2019/12/year-in-review-2019/images/thumb/" + imageName + ".png";

            //push categories to array to figure out how many there are
            if (!categoryArray.includes(category)) {
              categoryArray.push(category);
              self.$categoryList.append("<li class='" + category + "'><span class='bullet'></span>" + fullCategory + "</li>");
            }

            var storyEl = "<div class='story-frame'><div class='story-inner'><div id='story-" + id + "' class='story unclickable' data-cat='" + category + "'><button class='story-close'>close</button><div class='story-img'><img data-org='" + data[i].image + "' src='" + thumb + "' /></div><div class='story-content'><h2 class='story-title'><a href='" + data[i].url + "' target='_blank'>" + data[i].title + "</a></h2></div></div></div></div>";

            // <p class='story-teaser'>" + data[i].teaser + "</p>

            self.$grid.append(storyEl);
          }

          colorArray = ["#e84040","#a00000","#3c608d","#6894cb","#e2b64c","#ef945d","#69b993","#268270", "#962890", "#ef9dd3"];

          $(".story").each( function() {
            var curStory = $(this);
            var parent = curStory.closest(".story-frame");
            var storyId = curStory.attr("id");
            var idArr = storyId.split("-");
            var curId = idArr[1];
            var actualId = parseInt(curId);

            /*******  add color border based on category *********/
            var storyCat = curStory.attr("data-cat");
            var fullCategoryName;
            categoryListItem = self.$categoryList.find("li");

            for (var i = 0; i < colorArray.length; i++) {
              categoryListItem.each( function() {
                var listId = $(this).attr("class");
                if ( listId === categoryArray[i]) {
                  $(this).find(".bullet").css("background-color", colorArray[i]);
                  fullCategoryName = categoryListItem[i].innerText;
                }
              })

              if (storyCat === categoryArray[i]) {
                // $(this).css("border-left", "10px solid " + colorArray[i]);
                $(this).prepend("<span class='story-bullet' style='background-color:" + colorArray[i] + "'></span><span class='story-category' style='color: " + colorArray[i] + "'>" + fullCategoryName + "</span>")
              }

            }
            /*******  end: add color border based on category *********/

            //highlight story on click
            curStory.click( function(e) {
              // self.options.isPaused = true;
              self.options.userSelection = true;

              //remove any category selection
              self.options.categorySelected = false;
              $(".story-categories li").removeClass("isClicked");
              $(".story-categories li").removeClass("active");

              $(".story").removeClass("inactive");

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

              // self.options.isPaused = true;
              var popupOpen = false;
              self.options.categorySelected = false;
              var stories = $(".story");

              for (var i=0; i < stories.length; i++) {
                var current = stories[i];
                if ( $(current).hasClass("highlighted") ) {
                  popupOpen = true;
                }
              }

              //check if the user has clicked on a category
              for (var i=0; i < categoryListItem.length; i++) {
                var current = categoryListItem[i];
                if ( $(current).hasClass("isClicked") ) {
                  self.options.categorySelected = true;
                }
              }

              if (popupOpen === false && self.options.categorySelected === false) {
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
              } else if (self.options.categorySelected === true) {
                return;
              }

              categoryListItem.removeClass("active");
              $(".story").removeClass("inactive");
              self.options.isPaused = false;
              popupOpen = false;
            });

          });

          //Highlight all category items when hovering over category
          categoryListItem.hover( function() {

            if (self.options.categorySelected === true) {
              return;
            }

            var category = $(this).attr("class");
            self.highlightAllInCategory(category);

          }, function() {
            if (self.options.categorySelected === false) {
              $(".story").removeClass("inactive");
              // self.options.isPaused = false;
            }
          });

          //Highlight all category items when clicking on category
          categoryListItem.click( function() {
            self.options.categorySelected = true;
            $(".story-categories li").removeClass("isClicked");
            $(".story-categories li").removeClass("active");
            $(this).addClass("isClicked active");

            var classNames = $(this).attr("class");
            var category = classNames.replace(" isClicked active", "");
            self.highlightAllInCategory(category);
          });
      });

    },
    closeStory: function() {
      var self = this;

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
      }, 500);
    },
    highlightAllInCategory: function(category) {
      var self = this;

      // self.options.isPaused = true;
      var popupOpen = false;
      var stories = $(".story");

      for (var i=0; i < stories.length; i++) {
        var current = stories[i];
        if ( $(current).hasClass("highlighted") ) {
          popupOpen = true;
        }
      }

      // var category = $(this).attr("class");

      if (popupOpen === false) {
        stories.each( function() {
          var storyCat = $(this).attr("data-cat");
          var story = $(this);

          if (category !== storyCat) {
            story.addClass("inactive");
          } else {
            story.removeClass("inactive");
          }
        });
      }

      //display intro text for the current category
      //make sure siblings are hidden first
      $(".category li").removeClass("visible");
      $(".category li").each( function() {
        var introCat = $(this).attr("id");

        if (category === introCat) {
          $(this).addClass("visible");
        }
      })

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
