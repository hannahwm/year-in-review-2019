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
